const ExcelJS = require("exceljs");
const dayjs = require("dayjs");

class AttendanceReportsController {
  constructor(db) {
    this.db = db;
  }
  async getAll(req, res) {
    try {
      const output = await this.db.attendanceReports.findAll();
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getAllInExcel(req, res) {
    try {
      let output = await this.db.attendanceReports.findAll();

      // Group the output array by worksite
      const groupedByWorksite = output.reduce((acc, record) => {
        if (!acc[record.worksite]) {
          acc[record.worksite] = [];
        }
        acc[record.worksite].push(record);
        return acc;
      }, {});

      // Create a new workbook
      const workbook = new ExcelJS.Workbook();

      // Iterate over each group and create a worksheet for each
      Object.keys(groupedByWorksite).forEach((worksite) => {
        const worksheet = workbook.addWorksheet(worksite);

        // Define column headers
        const headers = [
          "worker_name",
          "worker_shift",
          "worksite",
          "workday_info", // Combined column for workday, check-in time, check-out time, duration worked, and remarks
        ];

        // Write headers to the worksheet
        worksheet.columns = headers.map((header) => ({
          header,
          key: header,
          width: 20,
        }));

        // Sort the records by id in ascending order
        const sortedRecords = groupedByWorksite[worksite].sort(
          (a, b) => a.id - b.id
        );

        // Write data to the worksheet
        sortedRecords.forEach((record) => {
          // Convert duration from minutes to hours and minutes
          //Math.floor(record.duration_worked / 60) is used to get the whole number of hours.
          //record.duration_worked % 60 is used to get the remaining minutes.
          const durationHours = Math.floor(record.duration_worked / 60);
          const durationMinutes = record.duration_worked % 60;

          const checkInTime = new Date(record.check_in_time);
          checkInTime.setHours(checkInTime.getHours());

          const checkOutTime = new Date(record.check_out_time);
          checkOutTime.setHours(checkOutTime.getHours());

          // Format checkInTime and checkOutTime to "hh:mm"
          const formattedCheckInTime =
            checkInTime.getHours().toString().padStart(2, "0") +
            ":" +
            checkInTime.getMinutes().toString().padStart(2, "0");
          const formattedCheckOutTime =
            checkOutTime.getHours().toString().padStart(2, "0") +
            ":" +
            checkOutTime.getMinutes().toString().padStart(2, "0");

          // Create a new row and populate it with data
          const row = worksheet.addRow({
            worker_name: record.worker_name,
            worker_shift: record.worker_shift,
            worksite: record.worksite,
            workday_info: `${record.workday}_${formattedCheckInTime} - ${formattedCheckOutTime}. Duration worked: ${durationHours}hrs${durationMinutes}mins. Remarks: ${record.remarks}`,
          });
        });
      });

      // Generate the current date and time for the file name
      const formattedDate = dayjs().format("YYYYMMDD");
      const now = new Date();
      const intlDateObj = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Singapore",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const formattedTime = intlDateObj
        .format(now)
        .replace(/[:\-]/g, "")
        .replace(" ", "_");
      const fileName = `AttendanceReports_${formattedDate}_${formattedTime}.xlsx`;

      // Save the workbook to a file
      await workbook.xlsx.writeFile(fileName);

      // Respond with a message indicating success
      return res.json({
        message: "Excel file generated successfully.",
        fileName,
      });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = AttendanceReportsController;
