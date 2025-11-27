
// Get all temperature readings (optionally filtered by date range)
export const getData = async (req, res) => {
  try {
    const io = req.app.get("io");
    let temps = null;
    let message = "";

    // If a file is uploaded (e.g., via multipart/form-data), parse it
    if (req.file) {
      temps = JSON.parse(req.file.buffer.toString());
      message = "Temperature readings from uploaded file";
    } else if (req.body && Object.keys(req.body).length > 0) {
      temps = req.body.data || req.body;
      message = "Temperature readings from JSON body";
    } else {
      return res.status(400).json({ message: "No data provided" });
    }

    // Emit new data to all connected clients
    if (io && temps) {
      io.emit("newData", temps);
    }

    return res.status(200).json({ temps, message });
  } catch (error) {
    console.error("Error fetching temperature readings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};