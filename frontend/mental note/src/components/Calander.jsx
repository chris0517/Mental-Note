import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthNames = [
  "Jan", 
  "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Calendar = () => {
  const [availableImages, setAvailableImages] = useState(new Set());
  const currentYear = new Date().getFullYear();
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;
  if (isLeapYear) daysInMonth[1] = 29;

  useEffect(() => {
    fetch("http://127.0.0.1:5000/image-files") // Fetch the list of available images
      .then((res) => res.json())
      .then((data) => setAvailableImages(new Set(data)))
      .catch((err) => console.error("Error fetching images:", err));
  }, []);

  const days = [];
  let dayCount = 1;

  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= daysInMonth[month]; day++) {
      const formattedDate = `${currentYear}${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
      days.push({
        day: day,
        month: monthNames[month],
        dayOfYear: dayCount++,
        imageUrl: availableImages.has(formattedDate) ? `http://127.0.0.1:5000/fetch-image/${formattedDate}.jpg` : null,
      });
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        padding: 2,
        marginTop: 10, // Moves down to avoid blocking navbar
        justifyContent: "center",
      }}
    >
      {days.map((day) => (
        <Box
          key={day.dayOfYear}
          sx={{
            width: 50,
            height: 50,
            border: "1px solid gray",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: 2,
            position: "relative",
          }}
        >
          {day.imageUrl && (
            <img 
              src={day.imageUrl} 
              alt={day.day} 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: "inherit",
                opacity: 0.6, // Makes the image slightly transparent
              }}
            />
          )}
          <Typography variant="caption" sx={{ position: "relative", color: "black", fontWeight: "bold" }}>
            {day.month} {day.day}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Calendar;
