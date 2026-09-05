const BASE_ITEMS = [
  { category: 'Documents', item: 'ID proof / Aadhar card' },
  { category: 'Documents', item: 'Emergency contact list' },
  { category: 'Health', item: 'Basic first-aid kit' },
  { category: 'Electronics', item: 'Phone charger' },
  { category: 'Electronics', item: 'Power bank' },
];

const TRIP_TYPE_RULES = {
  Trekking: [
    { category: 'Footwear', item: 'Trekking shoes' },
    { category: 'Equipment', item: 'Backpack (40L+)' },
    { category: 'Equipment', item: 'Headlamp' },
    { category: 'Safety', item: 'Rain protection' },
    { category: 'Clothing', item: 'Extra socks' },
  ],
  Beach: [
    { category: 'Clothing', item: 'Swimwear' },
    { category: 'Health', item: 'Sunscreen' },
    { category: 'Miscellaneous', item: 'Sunglasses' },
    { category: 'Miscellaneous', item: 'Waterproof pouch' },
    { category: 'Clothing', item: 'Extra change of clothes' },
  ],
  Adventure: [
    { category: 'Footwear', item: 'Sturdy closed shoes' },
    { category: 'Health', item: 'Extra first-aid supplies' },
  ],
  Cultural: [
    { category: 'Clothing', item: 'Modest/appropriate attire for religious sites' },
  ],
};

const TRANSPORT_RULES = {
  'Road Trip': [
    { category: 'Documents', item: 'Driving licence' },
    { category: 'Documents', item: 'Vehicle documents' },
    { category: 'Safety', item: 'Spare tyre check' },
    { category: 'Electronics', item: 'Offline maps downloaded' },
  ],
  Car: [
    { category: 'Documents', item: 'Driving licence' },
    { category: 'Electronics', item: 'Offline maps downloaded' },
  ],
};

const generateChecklist = ({ tripType = [], transport, durationDays }) => {
  const items = [...BASE_ITEMS];

  tripType.forEach((type) => {
    if (TRIP_TYPE_RULES[type]) {
      items.push(...TRIP_TYPE_RULES[type]);
    }
  });

  if (TRANSPORT_RULES[transport]) {
    items.push(...TRANSPORT_RULES[transport]);
  }

  if (durationDays >= 5) {
    items.push({ category: 'Clothing', item: 'Laundry bag (longer trip)' });
  }

  const seen = new Set();
  const deduped = items.filter((entry) => {
    const key = `${entry.category}:${entry.item}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped;
};

module.exports = { generateChecklist };