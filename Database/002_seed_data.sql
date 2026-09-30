-- ==============================================================================
-- MetroLab Seed Data — OIML R 76 Reference Instruments & Tests
-- ==============================================================================

-- 1. Insert Manufacturers
INSERT INTO manufacturers (id, name, code, country, contact_email, contact_person, address, website)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Mettler Toledo Metrology AG', 'MT-CH', 'Switzerland', 'compliance@mt.com', 'Dr. Hans Meier', 'Im Langacher 44, 8606 Greifensee', 'https://mt.com'),
  ('a0000000-0000-0000-0000-000000000002', 'Sartorius Lab Instruments GmbH', 'SART-DE', 'Germany', 'standards@sartorius.com', 'Frau Elena Weiss', 'Otto-Brenner-Strasse 20, 37079 Goettingen', 'https://sartorius.com'),
  ('a0000000-0000-0000-0000-000000000003', 'Avery Weigh-Tronix India', 'AWT-IN', 'India', 'legal.metrology@averyweigh-tronix.com', 'Rajesh Sharma', 'Plot 45, Sector 25, Ballabgarh, Haryana', 'https://averyweigh-tronix.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Test Categories
INSERT INTO test_categories (id, name, code, description, sort_order)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Metrological Performance Tests', 'MET-PERF', 'Core weighing, repeatability, and eccentricity checks per OIML R 76-1', 1),
  ('c0000000-0000-0000-0000-000000000002', 'Influence Quantities Tests', 'INFL-QTY', 'Static temperature, power voltage variations, damp heat stability', 2),
  ('c0000000-0000-0000-0000-000000000003', 'Disturbances & Immunity', 'DISTURB', 'Electrostatic discharge, radiated RF immunity, electrical fast transients', 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Test Definitions
INSERT INTO test_definitions (id, category_id, code, name, description, standard_reference, is_active)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'A.4.4.1', 'Weighing Performance Test', 'Testing errors of indication across min capacity, intermediate load points, and max capacity with increasing and decreasing loads', 'OIML R 76-1:2006 Clause A.4.4.1', TRUE),
  ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'A.4.7', 'Repeatability Test', 'Evaluation of dispersion of indications for successive loadings at approximately 0.5 Max and Max load', 'OIML R 76-1:2006 Clause A.4.7', TRUE),
  ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'A.4.8', 'Eccentricity Test', 'Verification of load receptable eccentricity effects at center and eccentric points with 1/3 Max load', 'OIML R 76-1:2006 Clause A.4.8', TRUE),
  ('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'A.4.2', 'Zero-setting and Tare Test', 'Accuracy of zero-setting device and maximum tare balancing effect', 'OIML R 76-1:2006 Clause A.4.2', TRUE),
  ('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'A.5.3', 'Static Temperature Test', 'Constant load indication stability across temperature extremes (-10 deg C to +40 deg C)', 'OIML R 76-1:2006 Clause A.5.3', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Instruments
INSERT INTO instruments (id, manufacturer_id, model_name, instrument_type, accuracy_class, max_capacity, min_capacity, verification_scale_interval_e, actual_scale_interval_d, tare_range, serial_number, device_version, description, status)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'XP-6002S Precision NAWI', 'Electronic Precision Non-Automatic Weighing Instrument', 'II', 6200.0000, 5.0000, 0.1000, 0.0100, '0 - 6200 g', 'SN-CH-2026-9041', 'Firmware v2.4.1', 'High-accuracy Class II laboratory balance with motorized draft shield and internal calibration weights', 'active'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'AWT-BenchScale 30K', 'Industrial Bench Platform Scale', 'III', 30000.0000, 100.0000, 10.0000, 2.0000, '0 - 15000 g', 'SN-IND-2026-5512', 'Firmware v1.0.8', 'Class III industrial bench scale for trade and packaging verification', 'active'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Entris-II Micro', 'Micro-Analytical Laboratory Balance', 'I', 220.0000, 0.0100, 0.0010, 0.0001, '0 - 220 g', 'SN-DE-2026-1188', 'Firmware v3.1.0', 'Special accuracy Class I analytical balance with monolithic weigh cell', 'under_evaluation')
ON CONFLICT (id) DO NOTHING;
