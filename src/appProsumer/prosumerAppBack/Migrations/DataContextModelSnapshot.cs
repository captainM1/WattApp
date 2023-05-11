﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using prosumerAppBack.DataAccess;

#nullable disable

namespace prosumerAppBack.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.3");

            modelBuilder.Entity("prosumerAppBack.Models.Device.Device", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("DeviceName")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("DeviceTypeID")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsOn")
                        .HasColumnType("INTEGER");

                    b.Property<string>("MacAdress")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("OwnerID")
                        .HasColumnType("TEXT");

                    b.HasKey("ID");

                    b.HasIndex("DeviceTypeID");

                    b.HasIndex("OwnerID");

                    b.ToTable("Devices");

                    b.HasData(
                        new
                        {
                            ID = new Guid("32ea7105-f582-4441-ae81-b738c4284f7e"),
                            DeviceName = "Ves Masina",
                            DeviceTypeID = new Guid("32ea7105-f582-4441-ae81-b738c4284f7e"),
                            IsOn = false,
                            MacAdress = "00-1B-63-84-45-E6",
                            OwnerID = new Guid("6bce51ea-9824-4393-b9a5-732b5a9b7f52")
                        },
                        new
                        {
                            ID = new Guid("32ea7105-f582-4441-ae81-b738c4284f7d"),
                            DeviceName = "Solarni Panel",
                            DeviceTypeID = new Guid("a2d2d5ec-b064-4f72-9e0e-84c1171cc14d"),
                            IsOn = false,
                            MacAdress = "00-1B-63-84-45-E7",
                            OwnerID = new Guid("6bce51ea-9824-4393-b9a5-732b5a9b7f52")
                        });
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.DeviceGroup", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("ID");

                    b.ToTable("DeviceGroups");

                    b.HasData(
                        new
                        {
                            ID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            Name = "Consumer"
                        },
                        new
                        {
                            ID = new Guid("18f30035-59de-474f-b9db-987476de551f"),
                            Name = "Producer"
                        },
                        new
                        {
                            ID = new Guid("b17c9155-7e6f-4d37-8a86-ea1abb327bb2"),
                            Name = "Storage"
                        });
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.DeviceManufacturers", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("ID");

                    b.ToTable("DeviceManufacturers");

                    b.HasData(
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4d"),
                            Name = "Bosch"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4e"),
                            Name = "Siemens"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4f"),
                            Name = "Miele"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d50"),
                            Name = "AEG"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d51"),
                            Name = "Electrolux"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d52"),
                            Name = "Zanussi"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d53"),
                            Name = "Beko"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d54"),
                            Name = "Indesit"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d55"),
                            Name = "Candy"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d56"),
                            Name = "Whirlpool"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d57"),
                            Name = "Gorenje"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d58"),
                            Name = "Smeg"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d59"),
                            Name = "Hoover"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d60"),
                            Name = "Grundig"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d61"),
                            Name = "Neff"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d62"),
                            Name = "Bauknecht"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d63"),
                            Name = "Hotpoint"
                        },
                        new
                        {
                            ID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d64"),
                            Name = "Ariston"
                        });
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.DeviceRequirement", b =>
                {
                    b.Property<Guid>("DeviceID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("ChargeEveryDay")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("ChargeEveryDayStatus")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ChargedUntil")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("ChargedUntilBattery")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("ChargedUntilBatteryStatus")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ChargedUpTo")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("ChargedUpToStatus")
                        .HasColumnType("INTEGER");

                    b.HasKey("DeviceID");

                    b.ToTable("DeviceRequirements");
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.DeviceRule", b =>
                {
                    b.Property<Guid>("DeviceID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("TurnOff")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("TurnOffStatus")
                        .HasColumnType("INTEGER");

                    b.Property<string>("TurnOn")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("TurnOnEvery")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("TurnOnEveryStatus")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("TurnOnStatus")
                        .HasColumnType("INTEGER");

                    b.HasKey("DeviceID");

                    b.ToTable("DeviceRules");
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.DeviceType", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("GroupID")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("ManufacturerID")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<double>("Wattage")
                        .HasColumnType("REAL");

                    b.HasKey("ID");

                    b.HasIndex("GroupID");

                    b.HasIndex("ManufacturerID");

                    b.ToTable("DeviceTypes");

                    b.HasData(
                        new
                        {
                            ID = new Guid("9d3d39b2-56d8-44e7-8ad5-b64efc6784fe"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d61"),
                            Name = "Washing Machine",
                            Wattage = 1000.0
                        },
                        new
                        {
                            ID = new Guid("d3105304-6ec5-4aed-9b53-9c7ef8e81c4c"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d60"),
                            Name = "Oven",
                            Wattage = 3500.0
                        },
                        new
                        {
                            ID = new Guid("73e8b43e-bfaf-4db9-9f36-cf40cc057a6c"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d58"),
                            Name = "Refrigerator",
                            Wattage = 250.0
                        },
                        new
                        {
                            ID = new Guid("815f9d3e-f0f8-4e0d-9b6e-9043293bee9d"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d52"),
                            Name = "Dishwasher",
                            Wattage = 1800.0
                        },
                        new
                        {
                            ID = new Guid("1ac7203e-b15c-47ce-bc23-08b5b62d225e"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4e"),
                            Name = "Dryer",
                            Wattage = 3400.0
                        },
                        new
                        {
                            ID = new Guid("0bda9b57-df0e-485e-b209-409b26f046e0"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d61"),
                            Name = "Cooker Hood",
                            Wattage = 110.0
                        },
                        new
                        {
                            ID = new Guid("06baaad5-80b8-446b-9480-948e8ba9d52b"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d63"),
                            Name = "Microwave",
                            Wattage = 1100.0
                        },
                        new
                        {
                            ID = new Guid("1435a6e0-fe87-4b65-90f2-cab08abc51fc"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d52"),
                            Name = "Freezer",
                            Wattage = 200.0
                        },
                        new
                        {
                            ID = new Guid("da04e45d-559b-4b24-b20b-2d7335db2cf0"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d56"),
                            Name = "Range",
                            Wattage = 4500.0
                        },
                        new
                        {
                            ID = new Guid("311175ce-f67c-4f5b-b96c-a11243534f3f"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4d"),
                            Name = "Washing Machine",
                            Wattage = 1000.0
                        },
                        new
                        {
                            ID = new Guid("783d8bd7-725b-42b6-a76b-6e9ad0fca6da"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d51"),
                            Name = "Refrigerator",
                            Wattage = 250.0
                        },
                        new
                        {
                            ID = new Guid("32ea7105-f582-4441-ae81-b738c4284f7e"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d54"),
                            Name = "Dishwasher",
                            Wattage = 1800.0
                        },
                        new
                        {
                            ID = new Guid("f2f9be26-5c5f-43e1-aa2f-8e64960d03dd"),
                            GroupID = new Guid("77cbc929-1cf2-4750-900a-164de4abe28b"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4d"),
                            Name = "Dryer",
                            Wattage = 3400.0
                        },
                        new
                        {
                            ID = new Guid("696e9069-6bac-47e4-a7c2-8c4779ed33bb"),
                            GroupID = new Guid("18f30035-59de-474f-b9db-987476de551f"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d50"),
                            Name = "Wind Turbine",
                            Wattage = 2000.0
                        },
                        new
                        {
                            ID = new Guid("696e9069-6bac-47e4-a7c2-8c4779ed33ba"),
                            GroupID = new Guid("18f30035-59de-474f-b9db-987476de551f"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d4f"),
                            Name = "Wind Turbine",
                            Wattage = 1000.0
                        },
                        new
                        {
                            ID = new Guid("a2d2d5ec-b064-4f72-9e0e-84c1171cc14f"),
                            GroupID = new Guid("18f30035-59de-474f-b9db-987476de551f"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d54"),
                            Name = "Solar Panel",
                            Wattage = 6000.0
                        },
                        new
                        {
                            ID = new Guid("a2d2d5ec-b064-4f72-9e0e-84c1171cc14d"),
                            GroupID = new Guid("18f30035-59de-474f-b9db-987476de551f"),
                            ManufacturerID = new Guid("4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d63"),
                            Name = "Solar Panel",
                            Wattage = 4000.0
                        });
                });

            modelBuilder.Entity("prosumerAppBack.Models.Dispatcher.Dispatcher", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("TEXT");

                    b.Property<string>("Role")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("Salt")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.HasKey("ID");

                    b.ToTable("Dispatchers");

                    b.HasData(
                        new
                        {
                            ID = new Guid("6bce51ea-9824-4393-b9a5-732b5a9b7f53"),
                            Email = "admin@gmail.com",
                            FirstName = "Adminovic",
                            LastName = "Adminovski",
                            PasswordHash = new byte[] { 11, 222, 18, 39, 242, 161, 84, 65, 216, 7, 167, 238, 226, 80, 239, 56, 253, 48, 195, 223, 71, 30, 28, 37, 125, 86, 119, 207, 92, 49, 215, 127 },
                            Role = "Admin",
                            Salt = new byte[] { 83, 53, 215, 205, 73, 196, 238, 53, 85, 207, 182, 115, 3, 28, 240, 14 }
                        });
                });

            modelBuilder.Entity("prosumerAppBack.Models.User", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Address")
                        .HasColumnType("TEXT");

                    b.Property<string>("City")
                        .HasColumnType("TEXT");

                    b.Property<string>("Country")
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<string>("PasswordResetToken")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("PasswordResetTokenExpires")
                        .HasColumnType("TEXT");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("TEXT");

                    b.Property<string>("Role")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("Salt")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<bool>("dsoHasControl")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("sharesDataWithDso")
                        .HasColumnType("INTEGER");

                    b.HasKey("ID");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            ID = new Guid("6bce51ea-9824-4393-b9a5-732b5a9b7f52"),
                            Address = "Radoja Domanovica 6",
                            City = "Kragujevac",
                            Country = "Serbia",
                            Email = "petarsimic@gmail.com",
                            FirstName = "Petar",
                            LastName = "Simic",
                            PasswordHash = new byte[] { 247, 116, 101, 117, 172, 44, 107, 166, 15, 106, 96, 78, 110, 9, 28, 246, 252, 39, 61, 138, 16, 16, 102, 9, 10, 192, 98, 226, 247, 8, 38, 33 },
                            PhoneNumber = "064-316-15-81",
                            Role = "UnapprovedUser",
                            Salt = new byte[] { 65, 62, 95, 6, 177, 112, 219, 133, 87, 101, 56, 208, 150, 84, 16, 209 },
                            dsoHasControl = false,
                            sharesDataWithDso = false
                        });
                });

            modelBuilder.Entity("prosumerAppBack.Models.UsersRequestedToDso", b =>
                {
                    b.Property<Guid>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<bool>("Approved")
                        .HasColumnType("INTEGER");

                    b.Property<Guid>("UserID")
                        .HasColumnType("TEXT");

                    b.HasKey("ID");

                    b.ToTable("UsersAppliedToDSO");
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.Device", b =>
                {
                    b.HasOne("prosumerAppBack.Models.Device.DeviceType", "DeviceType")
                        .WithMany("Devices")
                        .HasForeignKey("DeviceTypeID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("prosumerAppBack.Models.User", "Owner")
                        .WithMany("Devices")
                        .HasForeignKey("OwnerID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DeviceType");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.DeviceType", b =>
                {
                    b.HasOne("prosumerAppBack.Models.Device.DeviceGroup", "Group")
                        .WithMany("DeviceTypes")
                        .HasForeignKey("GroupID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("prosumerAppBack.Models.Device.DeviceManufacturers", "Manufacturer")
                        .WithMany("DeviceTypes")
                        .HasForeignKey("ManufacturerID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");

                    b.Navigation("Manufacturer");
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.DeviceGroup", b =>
                {
                    b.Navigation("DeviceTypes");
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.DeviceManufacturers", b =>
                {
                    b.Navigation("DeviceTypes");
                });

            modelBuilder.Entity("prosumerAppBack.Models.Device.DeviceType", b =>
                {
                    b.Navigation("Devices");
                });

            modelBuilder.Entity("prosumerAppBack.Models.User", b =>
                {
                    b.Navigation("Devices");
                });
#pragma warning restore 612, 618
        }
    }
}
