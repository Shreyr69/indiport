-- Remove duplicate delivery methods keeping the ones with better pricing
DELETE FROM delivery_methods WHERE id = 'cd3f636a-e5ca-44f8-a5c0-97fbcbc8fd0e'; -- Higher priced Express Delivery
DELETE FROM delivery_methods WHERE id = 'df45278b-be83-4b6a-a4e9-f8308c2ad0ee'; -- Duplicate Standard Delivery
DELETE FROM delivery_methods WHERE id = '104cbdcf-6c27-4ce6-81e0-9259582eb2a2'; -- Higher priced Same Day Delivery