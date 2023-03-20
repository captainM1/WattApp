import json
import random
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

# Create a dictionary to store the power usage data for each appliance
power_usage_data = {}

# Simulate power usage for each appliance
for appliance in average_power_usages:
    # Generate a list of timestamp and power usage pairs for the year
    timestamp_power_pairs = []
    current_date = start_date
    while current_date <= end_date:
        # Get the average power usage for the current appliance
        average_power_usage = average_power_usages[appliance]
        
        # Add some random variation to the power usage (between -10% and +10%)
        power_usage = average_power_usage * random.uniform(0.9, 1.1)
        
        # Add the timestamp and power usage pair to the list for every hour
        for i in range(24):
            timestamp = current_date.replace(hour=i, minute=0, second=0, microsecond=0).isoformat()
            timestamp_power_pairs.append({"timestamp": timestamp, "power_usage": power_usage / 24})
        
        # Move to the next day
        current_date += timedelta(days=1)
    
    # Add the list of timestamp and power usage pairs to the power usage data dictionary
    power_usage_data[hash(appliance)] = {"device_id": hash(appliance), "device_name":appliance,"timestamp_power_pairs": timestamp_power_pairs}

# Write the power usage data to a JSON file
with open("power_usage_data.json", "w") as f:
    json.dump(power_usage_data, f, indent=2)

print("Power usage data generated and saved to power_usage_data.json")
