﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using prosumerAppBack.Models;

namespace prosumerAppBack.BusinessLogic.PowerUsageService;

public interface IPowerUsageService
{
    public double GetForDevice(Guid deviceID);
    double GetPowerUsageForDay(Guid deviceID, DateTime today);
    public PowerUsage GetPowerUsageFor7Days(Guid deviceId, int direction);
    public PowerUsage GetPowerUsageForAMonth(Guid deviceId, int direction);
    public double AverageSumPowerUsageProduction(Guid userID);
    public double AverageSumPowerUsageConsumtion(Guid userID);
    public double CurrentSumPowerUsageProduction(Guid userID);
    public double CurrentSumPowerUsageConsumption(Guid userID);
    public PowerUsage GetPowerConsumedForADaySystem();
    public PowerUsage GetPowerProducedForADaySystem();
    public double GetCurrentPowerProduction();
    public double GetCurrentPowerConsumption();
    public double CurrentSumPowerUsageSystemConsumer();
    public double CurrentSumPowerUsageSystemProducer();
    public double GetPoweUsageForAMonthSystemProducer(int direction);
    public double GetPoweUsageForAMonthSystemConsumer(int direction);
    public List<PowerUsage> GetPowerUsageSumByDeviceConsumer(int direction);
    public List<PowerUsage> GetPowerUsageSumByDeviceProducer(int direction);
    public PowerUsage GetPowerUsagesForEachDayConsumtionMonth(int direction);
    public PowerUsage GetPowerUsagesForEachDayProductionMonth(int direction);
    public IEnumerable<TimestampPowerPair> GetForDeviceByHour(Guid deviceID);
    public List<PowerUsage> GetPowerUsageForDevicesConsumption(Guid userID, int direction, int shareData);
    public List<PowerUsage> GetPowerUsageForDevicesProduction(Guid userID, int direction, int shareData);
    List<PowerUsage> GetPowerUsageForDevicesConsumptionFor7Days(Guid userID, int direction, int shareData);
    List<PowerUsage> GetPowerUsageForDevicesProductionFor7Days(Guid userID, int direction, int shareData);
    public PowerUsage GetPowerUsageFor12HoursUpDown(Guid deviceID);
    PowerUsage GetPowerUsageForDevicePast24Hours(Guid deviceID, int direction);
    List<PowerUsage> GetPowerUsageForDevicesProductionFor24Hours(Guid userID, int direction, int shareData);
    List<PowerUsage> GetPowerUsageForDevicesConsumptionFor24Hours(Guid userID, int direction, int shareData);
    public PowerUsage GetMaxUsagePast24HoursConsumption(Guid userID);
    public PowerUsage GetMaxUsagePast24HoursProduction(Guid userID);
    public PowerUsage GetMaxUsagePreviousWeekConsumption(Guid userID);
    public PowerUsage GetMaxUsagePreviousMonthConsumption(Guid userID, int direction);
    public PowerUsage GetMaxUsagePreviousCurrentConsumption(Guid userID, int shareData);
    public PowerUsage GetMaxUsagePreviousWeekProductoin(Guid userID);
    public PowerUsage GetMaxUsagePreviousMonthProduction(Guid userID, int direction);
    public PowerUsage GetMaxUsagePreviousCurrentProduction(Guid userID, int shareData);
    public double SavedEnergySystemProducer();
    public double SavedEnergySystemConsumer();
    public double DeviceSystemPowerUsage(Guid deviceID);
    object? GetPowerUsageForDevicePast24Hoursv2(Guid deviceId, int i);
    double GetHowMuchUserIsConsuming(Guid userId);
    public double deviceEnergySaved(Guid deviceID);
    public double savedEnergyForUserConsumer(Guid userID);
    public double savedEnergyForUserProducer(Guid userID);
    public PowerUsage GetPowerUsagesForEachDayProductionWeek(int direction);
    public PowerUsage GetPowerUsagesForEachDayConsumptionWeek(int direction);
    public PowerUsage GetPowerUsagesForEachDayConsumption24h(int direction);
    public PowerUsage GetPowerUsagesForEachDayProduction24h(int direction);
    public double percentPowerUsageDifferenceForPreviousHourConsumption(Guid userId);
    public double percentPowerUsageDifferenceForPreviousHourProduction(Guid userId);
    public double percentPowerUsageDifferenceForPreviousHourConsumptionSystem();
    public double percentPowerUsageDifferenceForPreviousHourProductionSystem();
    public double electricityBillForCurrentMonth(Guid userID, double electricityRate);
    public double electricityBillLastMonth(Guid userID, double electricityRate);
    public double electricityBill2MonthsAgo(Guid userID, double electricityRate);
    public double electricityEarningsForCurrentMonth(Guid userID, double electricityRate);
    public double electricityEarnings2MonthsAgo(Guid userID, double electricityRate);
    public double electricityEarningsLastMonth(Guid userID, double electricityRate);
}
