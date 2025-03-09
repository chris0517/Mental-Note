import os
import shutil
from datetime import datetime, timedelta


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESULTS_FOLDER = os.path.join(BASE_DIR, "results")

# Get all existing image files in the results folder
image_files = [f for f in os.listdir(RESULTS_FOLDER) if f.endswith(".jpg")]

# Extract available dates from filenames (assuming format YYYYMMDD.jpg)
available_dates = set()
for filename in image_files:
    try:
        date_str = filename.split(".")[0]  # Extract date part
        datetime.strptime(date_str, "%Y%m%d")  # Validate format
        available_dates.add(date_str)
    except ValueError:
        print(f"Skipping invalid file: {filename}")

# Generate a list of all dates for the current year
current_year = datetime.now().year
all_dates = { (datetime(current_year, 1, 1) + timedelta(days=i)).strftime("%Y%m%d") for i in range(365) }

# Identify missing dates
missing_dates = sorted(all_dates - available_dates)

if not missing_dates:
    print("No missing dates. All days are covered!")
else:
    print(f"Missing {len(missing_dates)} dates. Duplicating images...")

    # Loop through missing dates and assign an existing image to each
    existing_images = list(available_dates)
    for i, missing_date in enumerate(missing_dates):
        source_image = os.path.join(RESULTS_FOLDER, f"{existing_images[i % len(existing_images)]}.jpg")
        target_image = os.path.join(RESULTS_FOLDER, f"{missing_date}.jpg")
        
        shutil.copy(source_image, target_image)  # Duplicate the file
        print(f"Created {target_image} from {source_image}")

print("Image duplication complete!")
