/* Product data. Edit through admin.html (or by hand: keep valid JSON). */
const PRODUCTS = [
 {
  "id": "silver-oud",
  "name": "Silver Oud",
  "cat": "Oud",
  "gender": "Unisex",
  "price": 1699,
  "sale": null,
  "notes": "",
  "best": true,
  "img": "images/silver-oud.jpg",
  "desc": "Rich oud character with refined elegance. A scent that leaves a legacy. 50 ml eau de parfum.",
  "tagline": "A scent that leaves a legacy.",
  "points": [
   "Rich oud character",
   "Refined elegance",
   "Unforgettable presence"
  ],
  "lasting": "",
  "season": "",
  "occasion": ""
 },
 {
  "id": "tester-set",
  "name": "Tester Collection",
  "cat": "Bundle",
  "gender": "Unisex",
  "price": 1299,
  "sale": null,
  "notes": "",
  "best": false,
  "tag": "Launch offer",
  "label": "Tester Collection 5 x 5ml",
  "size": "5 testers × 5 ml",
  "type": "Perfume testers",
  "img": "images/tester-set.jpg",
  "img2": "images/tester-set-photo.jpg",
  "desc": "A limited-edition tester collection of five 5 ml testers, for every mood and every moment.",
  "tagline": "One collection. Five signature scents.",
  "points": [
   "Five 5 ml testers",
   "Nayel, Almira, Blue Sea, Gucci Flora, Blue Lady",
   "Limited edition"
  ],
  "lasting": "",
  "season": "",
  "occasion": "",
  "long": "The Jasbaan Tester Collection is a limited-edition set of five 5 ml perfume testers: Nayel, Almira, Blue Sea, Gucci Flora and Blue Lady. It is an exclusive launch bundle priced at PKR 1,299 for the whole set. Each tester is a small spray bottle with the Jasbaan label, so you can try every fragrance on your skin, find the one that feels like you, and then choose a full bottle. For the best result, spray on clean, moisturised skin at the wrists and neck, and keep the testers away from heat and direct sunlight. To order, add the set to your bag and send your order on WhatsApp, or message us on +92 371 2272628. Delivery areas, timing and charges are confirmed with you when you order, and the checkout offers Cash on Delivery."
 },
 {
  "id": "blue-sea",
  "name": "Blue Sea",
  "cat": "Fresh",
  "gender": "Men",
  "price": 1499,
  "sale": null,
  "notes": "",
  "best": false,
  "img": "images/blue-sea.jpg",
  "desc": "Fresh and bold. Make waves and leave an impression. 50 ml eau de parfum.",
  "tagline": "Make waves. Leave an impression.",
  "points": [
   "Fresh",
   "Bold",
   "Unforgettable"
  ],
  "lasting": "",
  "season": "",
  "occasion": ""
 },
 {
  "id": "scent-of-love",
  "name": "Scent of Love",
  "cat": "Signature",
  "gender": "Women",
  "price": 1799,
  "sale": null,
  "notes": "",
  "best": false,
  "img": "images/scent-of-love.jpg",
  "desc": "A fragrance that leaves a lasting impression. Elegant and feminine. 50 ml eau de parfum.",
  "tagline": "A fragrance that leaves a lasting impression.",
  "points": [
   "Long lasting fragrance",
   "Premium ingredients",
   "Elegant and feminine"
  ],
  "lasting": "Long lasting fragrance",
  "season": "",
  "occasion": ""
 },
 {
  "id": "gucci-flora",
  "name": "Gucci Flora",
  "cat": "Floral",
  "gender": "Women",
  "price": 1699,
  "sale": null,
  "notes": "",
  "best": true,
  "img": "images/gucci-flora.jpg",
  "desc": "A timeless fragrance of luxury and elegance, for every special moment. 50 ml eau de parfum.",
  "tagline": "More than a fragrance. It is a feeling.",
  "points": [
   "Floral essence",
   "Long lasting fragrance",
   "Premium quality"
  ],
  "lasting": "Long lasting fragrance that stays with you all day",
  "season": "",
  "occasion": ""
 },
 {
  "id": "nayel",
  "name": "Nayel",
  "cat": "Signature",
  "gender": "Men",
  "price": 1499,
  "sale": null,
  "notes": "",
  "best": false,
  "img": "images/nayel.jpg",
  "img2": "images/nayel-photo.jpg",
  "desc": "A fragrance that leaves a lasting impression. Elegant and masculine. 50 ml eau de parfum.",
  "tagline": "A fragrance that leaves a lasting impression.",
  "points": [
   "Long lasting fragrance",
   "Premium ingredients",
   "Elegant and masculine"
  ],
  "lasting": "Long lasting fragrance",
  "season": "",
  "occasion": ""
 },
 {
  "id": "admire",
  "name": "Admire",
  "cat": "Signature",
  "gender": "Men",
  "price": 1899,
  "sale": null,
  "notes": "",
  "best": false,
  "img": "images/admire.jpg",
  "img2": "images/admire-photo.jpg",
  "desc": "A fragrance that leaves a lasting impression. 50 ml eau de parfum.",
  "tagline": "A fragrance that leaves a lasting impression.",
  "points": [
   "Long lasting fragrance",
   "Premium ingredients"
  ],
  "lasting": "Long lasting fragrance",
  "season": "",
  "occasion": ""
 },
 {
  "id": "blue-lady",
  "name": "Blue Lady",
  "cat": "Signature",
  "gender": "Women",
  "price": 1599,
  "sale": null,
  "notes": "",
  "best": false,
  "img": "images/blue-lady.jpg",
  "desc": "A fragrance that defines you. Elegant, timeless and unforgettable. 50 ml eau de parfum.",
  "tagline": "A fragrance that defines you.",
  "points": [
   "Long lasting fragrance",
   "Premium quality essence",
   "For every special moment"
  ],
  "lasting": "Long lasting fragrance",
  "season": "",
  "occasion": ""
 },
 {
  "id": "salaar",
  "name": "Salaar",
  "cat": "Signature",
  "gender": "Men",
  "price": 1999,
  "sale": null,
  "notes": "",
  "best": false,
  "img": "images/salaar.jpg",
  "desc": "A signature eau de parfum from Jasbaan. 50 ml eau de parfum.",
  "tagline": "Wear confidence.... Wear JASBAAN.",
  "points": [
   "Signature fragrance",
   "Eau de parfum"
  ],
  "lasting": "",
  "season": "",
  "occasion": ""
 },
 {
  "id": "roma",
  "name": "Roma",
  "cat": "Floral",
  "gender": "Women",
  "price": 1999,
  "sale": null,
  "notes": "",
  "best": false,
  "img": "images/roma.jpg",
  "desc": "A floral eau de parfum from Jasbaan. Luxury in every spray. 50 ml eau de parfum.",
  "tagline": "Luxury in every spray.",
  "points": [
   "Floral fragrance",
   "Long lasting",
   "Luxury in every spray"
  ],
  "lasting": "Long lasting",
  "season": "",
  "occasion": ""
 }
];
