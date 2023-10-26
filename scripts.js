/**
 * @typedef {Object} Product
 * @property {number} id Auðkenni vöru, jákvæð heiltala stærri en 0.
 * @property {string} title Titill vöru, ekki tómur strengur.
 * @property {string} description Lýsing á vöru, ekki tómur strengur.
 * @property {number} price Verð á vöru, jákvæð heiltala stærri en 0.
 */

/**
 * Fylki af vörum sem hægt er að kaupa.
 * @type {Array<Product>}
 */
const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

/**
 * @typedef {Object} CartLine
 * @property {Product} product Vara í körfu.
 * @property {number} quantity Fjöldi af vöru.
 */

/**
 * @typedef {Object} Cart
 * @property {Array<CartLine>} lines Fylki af línum í körfu.
 * @property {string|null} name Nafn á kaupanda ef skilgreint, annars `null`.
 * @property {string|null} address Heimilisfang kaupanda ef skilgreint, annars `null`.
 */

/**
 * Karfa sem geymir vörur sem notandi vill kaupa.
 * @type {Cart}
 */
const cart = {
  lines: [],
  name: null,
  address: null,
};

// --------------------------------------------------------
// Hjálparföll

/**
 * Sníða (e. format) verð fyrir íslenskar krónur með því að nota `Intl` vefstaðalinn.
 * Athugið að Chrome styður ekki íslensku og mun því ekki birta verð formuð að íslenskum reglum.
 * @example
 * const price = formatPrice(123000);
 * console.log(price); // Skrifar út `123.000 kr.`
 * @param {number} price Verð til að sníða.
 * @returns Verð sniðið með íslenskum krónu.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
 */
function formatPrice(price) {
  // Breyta tölu yfir í streng og bæta punkti við þriðju hverja tölu frá enda til hægri
  const parts = price.toFixed(0).toString().split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  //Bæta við "kr."
  return `${integerPart} kr.`;

}
/**
 * Athuga hvort `num` sé heiltala á bilinu `[min, max]`.
 * @param {number} num Tala til að athuga.
 * @param {number} min Lágmarksgildi tölu (að henni meðtaldri), sjálfgefið `0`.
 * @param {number} max Hámarksgildi tölu (að henni meðtaldri), sjálfgefið `Infinity`.
 * @returns `true` ef `num` er heiltala á bilinu `[min, max]`, annars `false`.
 */
function validateInteger(num, min = 0, max = Infinity) {
  if (Number.isInteger(num) && num >= min && num <= max) {
    return true;
  }
  return false;
}

/**
 * Sníða upplýsingar um vöru og hugsanlega fjölda af henni til að birta notanda.
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * ```
 * @param {Product} product Vara til að birta
 * @param {number | undefined} quantity Fjöldi af vöru, `undefined` ef ekki notað.
 * @returns Streng sem inniheldur upplýsingar um vöru og hugsanlega fjölda af henni.
 */
function formatProduct(product, quantity = undefined) {
  let formattedString = `${product.title} — ${formatPrice(product.price)}`;
  if (quantity !== undefined) {
    const totalPrice = product.price * quantity;
    formattedString += ` — ${quantity}x${formatPrice(product.price)} samtals ${formatPrice(totalPrice)}`;
  }
  return formattedString;}

/**
 * Skila streng sem inniheldur upplýsingar um körfu.
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @param {Cart} cart Karfa til að fá upplýsingar um.
 * @returns Streng sem inniheldur upplýsingar um körfu.
 */
function cartInfo(cart) {
  // Athuga hvort körfan er ekki skilgreind eða tóm
  if (!cart || Object.keys(cart).length === 0) {
    return 'Karfan er tóm.';
  }

  let cartString = '';
  let totalPrice = 0;

  // Fer í gegnum öll pör í körfu með Object.keys
  Object.keys(cart).forEach(key => {
    const item = cart[key];
    const itemTotalPrice = item.product.price * item.quantity;
    totalPrice += itemTotalPrice;
    cartString += `${item.product.title} — `;
    if (item.quantity > 1) {
      cartString += `${item.quantity}x${formatPrice(item.product.price)} samtals ${formatPrice(itemTotalPrice)}\n`;
    } else {
      cartString += `${formatPrice(item.product.price)}\n`;
    }
  });

  // Samtals verð
  cartString += `Samtals: ${formatPrice(totalPrice)}`;

  return cartString;
}

// --------------------------------------------------------
// Föll fyrir forritið

/**
 * Bætir vöru við `products` fylkið með því að biðja um upplýsingar frá notanda um:
 * - Titil, verður að vera ekki tómur strengur.
 * - Lýsingu, verður að vera ekki tómur strengur.
 * - Verð, verður að vera jákvæð heiltala stærri en 0.
 * Ef eitthvað er ekki löglegt eru birt villuskilaboð í console og hætt er í fallinu.
 * Annars er ný vara búin til og upplýsingar um hana birtar í console.
 * @returns undefined
 */
function addProduct() {
  const title = prompt('Titill:');
  if (!title) {
    console.error('Titill má ekki vera tómur.');
    return;
  }

  const description = prompt('Lýsing:');
  if (!description) {
    console.error('Lýsing má ekki vera tóm.');
    return;
  }

  const priceAsString = prompt('Verð:');
  if (!priceAsString) {
    console.error('Verð má ekki vera tómt.');
    return;
  }

  const price = Number.parseInt(priceAsString, 10);

  if (!validateInteger(price, 1)) {
    console.error('Verð verður að vera jákvæð heiltala.');
    return;
  }

  const id = products.length + 1;

  /** @type {Product} */
  const product = {
    id,
    title,
    description,
    price,
  };

  products.push(product);

  console.info(`Vöru bætt við:\n${formatProduct(product)}`);
}

/**
 * Birta lista af vörum í console.
 * @example
 * ```text
 * #1 HTML húfa — Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota. — 5.000 kr.
 * ```
 * @returns undefined
 */
function showProducts() {
  /*const products = [
    {
      name: 'HTML húfa',
      description: 'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
      price: 5000
    },
  ];*/

  products.forEach((product, index) => {
    const formattedPrice = formatPrice(product.price);

    console.log(`#${index + 1} ${product.title} — ${product.description} — ${formattedPrice}`);
  });
}

/**
 * Bæta vöru við körfu.
 * Byrjar á að biðja um auðkenni vöru sem notandi vill bæta við körfu.
 * Ef auðkenni er ekki heiltala, eru birt villa í console með skilaboðunum:
 * „Auðkenni vöru er ekki löglegt, verður að vera heiltala stærri en 0.“
 * Ef vara finnst ekki með gefnu auðkenni, eru birt villa í console með skilaboðunum:
 * „Vara fannst ekki.“
 * Því næst er beðið um fjölda af vöru sem notandi vill bæta við körfu. Ef fjöldi er ekki heiltala
 * á bilinu `[1, 100>`, eru birtar villuskilaboð í console með skilaboðunum:
 * „Fjöldi er ekki löglegur, lágmark 1 og hámark 99.“
 * Ef vara og fjöldi eru lögleg gildi er vöru bætt við körfu. Ef vara er nú þegar í körfu er fjöldi
 * uppfærður, annars er nýrri línu bætt við körfu.
 *
 * @returns undefined
 */
function addProductToCart() {
  debugger;
  const productIdAsString = prompt('Sláðu inn auðkenni vöru:');
  if (!productIdAsString) {
    console.error('Auðkenni vöru er ekki löglegt, verður að vera heiltala stærri en 0.');
    return;
  }

  const productId = Number.parseInt(productIdAsString);

  const product = products.find((i) => i.id === productId)
  if(!product){
    console.error("Vara fannst ekki")
    return;
  }
  const quantityAsString = prompt('Sláðu inn fjölda vöru:');
  const quantity = Number.parseInt(quantityAsString);

  if (isNaN(quantity) || quantity < 1 || quantity > 99) {
    console.error('Fjöldi er ekki löglegur, lágmark 1 og hámark 99.');
    return;
  }

  let productInCart = cart.lines.find((product) => product.id === productId);
  if (productInCart) {
    productInCart.quantity += quantity;
  } else {
    const newLine = { product, quantity };
    cart.lines.push(newLine);
  }
}
/**
 * Birta upplýsingar um körfu í console. Ef ekkert er í körfu er „Karfan er tóm.“ birt, annars
 * birtum við upplýsingar um vörur í körfu og heildarverð.
 *
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @returns undefined
 */
function showCart() {
  if (cart.length === 0) {
    console.log('Karfan er tóm.');
  } else {
    let totalPrice = 0;

    cart.forEach(item => {
      const itemTotalPrice = item.product.price * item.quantity;
      totalPrice += itemTotalPrice;

      const formattedPrice = formatPrice(item.product.price);

      if (item.quantity > 1) {
        console.log(`${item.product.name} — ${item.quantity}x${formattedPrice} samtals ${formatPrice(itemTotalPrice)}`);
      } else {
        console.log(`${item.product.name} — ${formattedPrice}`);
      }
    });

    console.log(`Samtals: ${formatPrice(totalPrice)}`);
  }
}


/**
 * Klárar kaup og birtir kvittun í console.
 * Ef ekkert er í körfu eru birt skilboð í console:
 * „Karfan er tóm.“
 * Annars er notandi beðinn um nafn og heimilisfang, ef annaðhvort er tómt eru birt villuskilaboð í
 * console og hætt í falli.
 * Ef allt er í lagi er kvittun birt í console með upplýsingum um pöntun og heildarverð.
 * @example
 * ```text
 * Pöntun móttekin <nafn>.
 * Vörur verða sendar á <heimilisfang>.
 *
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @returns undefined
 */
function checkout() {
  if (cart.length === 0) {
    console.log('Karfan er tóm.');
    return;
  }

  const name = prompt('Sláðu inn nafn:');
  const address = prompt('Sláðu inn heimilisfang:');

  if (!name || !address) {
    console.error('Nafn og heimilisfang eru nauðsynleg gögn.');
    return;
  }

  console.log(`Pöntun móttekin ${name}.`);
  console.log(`Vörur verða sendar á ${address}.\n`);

  showCart(); 
}
