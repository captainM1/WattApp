import json
import random
from datetime import datetime, timedelta

# Define the start and end dates for the simulation (one year)
start_date = datetime(year=2023, month=1, day=1)
end_date = datetime(year=2023, month=12, day=31)

average_power_productions = {
    "storage": [
        {
            "id": "9D3D39B2-56D8-44E7-8AD5-B64EFC6784F1",
            "max_capacity": 10000,
            "average_charging": 200,
            "average_usage": 100
        },
        {
            "id": "9D3D39B2-56D8-44E7-8AD5-B64EFC6784F2",
            "max_capacity": 15000,
            "average_charging": 300,
            "average_usage": 150
        },
        {
            "id": "9D3D39B2-56D8-44E7-8AD5-B64EFC6784F3",
            "max_capacity": 12000,
            "average_charging": 250,
            "average_usage": 120
        }
    ]
}

# Create a list to store the power storage data
power_storage_data = []

# Simulate power charging and usage for the storage device
for device in average_power_productions['storage']:
    # Get the maximum storage capacity and average charging/usage values for the current device
    max_capacity = device['max_capacity']
    average_charging = device['average_charging']
    average_usage = device['average_usage']

    # Generate a list of timestamp and storage level pairs for the year
    timestamp_storage_pairs = []
    current_date = start_date
    while current_date <= end_date:

        if not timestamp_storage_pairs:
            timestamp_storage_pairs.append({"timestamp": current_date.replace(hour=0, minute=0, second=0, microsecond=0).isoformat(), "power_usage": 0})
        # Loop over all 24 hours of the day, generating a timestamp-storage level pair for each hour
        for i in range(24):
            # Determine if the storage is being charged, used, or idle during this hour
            is_charging = False
            is_usage = False
            if random.random() < 0.2:
                is_charging = True
            elif random.random() < 0.2:
                is_usage = True

            # Calculate the storage level based on charging or usage
            if is_charging:
                # Add some random variation to the charging value (between -10% and +10%)
                charging = average_charging * random.uniform(0.9, 1.1)
                storage_level = min(max_capacity, timestamp_storage_pairs[-1]['power_usage'] + charging / 24)
            elif is_usage:
                # Add some random variation to the usage value (between -10% and +10%)
                usage = average_usage * random.uniform(0.9, 1.1)
                storage_level = max(0, timestamp_storage_pairs[-1]['power_usage'] - usage / 24)
            else:
                # If the storage is idle, maintain the same storage level as the previous hour
                storage_level = timestamp_storage_pairs[-1]['power_usage']

            # Add the timestamp and storage level pair to the list
            timestamp_storage_pairs.append({"timestamp": current_date.replace(hour=i, minute=0, second=0, microsecond=0).isoformat(), "power_usage": storage_level})

        # Move to the next day
        current_date += timedelta(days=1)

    # Add the dictionary with device id and timestamp/storage level pairs to the power storage data list
    power_storage_data.append({"device_id": device['id'], "timestamp_storage_pairs": timestamp_storage_pairs})

# Write the power storage data to a JSON file
with open("power_storage_data.json", "w") as f:
    json.dump(power_storage_data, f, indent=2)

print("Power storage data generated and saved to power_storage_data.json")
