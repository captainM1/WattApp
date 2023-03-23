import json
import random
import uuid
from datetime import datetime, timedelta

# Define the average power usage of each appliance in watts
average_power_usages = {
    "fridge": 200,
    "washing_machine": 1000,
    "oven": 2500,
    "boiler": 3000,
    "dishwasher": 1500,
    "heater": 2000
}

# Define the start and end dates for the simulation (one year)
start_date = datetime(year=2023, month=1, day=1)
end_date = datetime(year=2023, month=12, day=31)

# Create a list to store the power usage data for each device
power_usage_data = []

# Simulate power usage for each appliance
for appliance in average_power_usages:
    # Generate a list of timestamp and power usage pairs for the year
    timestamp_power_pairs = []
    current_date = start_date
    while current_date <= end_date:
        # Get the average power usage for the current appliance
        average_power_usage = average_power_usages[appliance]
        
        # Loop over all 24 hours of the day, generating a timestamp-power usage pair for each hour
        for i in range(24):
            # Check if the device is off during this hour
            is_off = False
            for start_off_period in range(0, 24, 6):
                if i >= start_off_period and i < start_off_period+6 and random.random() < 0.2:
                    is_off = True
                    break
            
            # If the device is off during this hour, set the power usage to 0
            if is_off:
                timestamp_power_pairs.append({"timestamp": current_date.replace(hour=i, minute=0, second=0, microsecond=0).isoformat(), "power_usage": 0})
            else:
                # Add some random variation to the power usage (between -10% and +10%)
                power_usage = average_power_usage * random.uniform(0.9, 1.1)
                
                # Add the timestamp and power usage pair to the list
                timestamp_power_pairs.append({"timestamp": current_date.replace(hour=i, minute=0, second=0, microsecond=0).isoformat(), "power_usage": power_usage / 24})
        
        # Move to the next day
        current_date += timedelta(days=1)
    
    # Add the dictionary with device id and timestamp/power usage pairs to the power usage data list
    power_usage_data.append({"device_id": str(uuid.uuid4()),"timestamp_power_pairs": timestamp_power_pairs})

# Write the power usage data to a JSON file
with open("power_usage_data.json", "w") as f:
    json.dump(power_usage_data, f, indent=2)

print("Power usage data generated and saved to power_usage_data.json")