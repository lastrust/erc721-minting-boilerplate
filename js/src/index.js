import "main.css";
import env from "../env.json";
import bunzz from "bunzz-sdk";

const DAPP_ID = env.JS_DAPP_ID;
const API_KEY = env.JS_API_KEY;
const NFT_STORAGE_KEY = env.JS_APP_NFT_STORAGE_KEY;
let handler = null,
  userAddress = null,
  contract = null,
  type = null,
  blob = null,
  base64 = null,
  tokenId = null,
  name = "",
  description = "";
const init = async () => {
  handler = await bunzz.initializeHandler({
    dappId: DAPP_ID,
    apiKey: API_KEY,
  });
  return handler;
};

const customStore = async (name, description, data, type, base64) => {
  var formData = new FormData();
  formData.append("image", new File([data], { type }));
  formData.append(
    "meta",
    JSON.stringify({
      name,
      description,
      base64: base64,
    })
  );
  const response = await fetch("https://api.nft.storage/store/", {
    headers: {
      authorization: `Bearer ${NFT_STORAGE_KEY}`,
    },
    body: formData,
    method: "POST",
  });
  const result = await response.json();

  if (result.ok === true) {
    const { value } = result;
    return value;
  } else {
    throw new Error(result.error.message);
  }
};

const setup = async () => {
  try {
    userAddress = await handler.getSignerAddress();
    contract = await handler.getContract("NFT (IPFS Mintable)");
  } catch (error) {
    console.error(error);
  }
};
const main = async () => {
  await init();
  await setup();
  renderContents();
};

const toggleShowHide = (element) => {
  element.classList.toggle("hidden");
};

const toggleShowHideByClassName = (className) => {
  const element = document.getElementsByClassName(className)[0];
  element.classList.toggle("hidden");
};

const mint = async () => {
  toggleShowHideByClassName("mint");
  toggleShowHideByClassName("loading");
  try {
    name = document.getElementsByName("name")[0].value;
    description = document.getElementsByName("description")[0].value;
    const metadata = await customStore(name, description, blob, type, base64);
    console.log("url", metadata.url);
    const inputUrl = metadata.url.replace(/^ipfs:\/\//, "");
    console.log(inputUrl);
    const tx = await contract.safeMint(userAddress, inputUrl);
    const receipt = await tx.wait();
    const event = receipt.events[0];
    const _tokenId = event.args[2];
    tokenId = _tokenId;
    base64 = null;
    window.alert("Succeeded to mint");

    addTextAndShowElement("token", `Token ID: ${tokenId}`);
  } catch (err) {
    console.error(err);
  } finally {
    toggleShowHideByClassName("mint");
    toggleShowHideByClassName("loading");
  }
};

const addTextAndShowElement = (className, text) => {
  document.getElementsByClassName(className)[0].innerText = text;
  toggleShowHideByClassName(className);
};

const get = async () => {
  toggleShowHideByClassName("get");
  try {
    console.log(contract, tokenId);
    tokenId = document.getElementsByName("tokenId")[0].value;
    const { data: tokenUri } = await contract.tokenURI(tokenId);
    const url = tokenUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
    const res = await fetch(url);
    const data = await res.json();
    base64 = data.base64;
    name = data.name;
    description = data.description;
    showImage("get-preview", base64);
    addTextAndShowElement("name", `Name: ${name}`);
    addTextAndShowElement("description", `Description: ${description}`);
  } catch (err) {
    console.error(err);
  } finally {
    toggleShowHideByClassName("get");
  }
};

const selectFile = function (e) {
  if (e) {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      readAsBlob(file);
      readAsBase64(file);
      type = file.type;
    }
  }
};
const readAsBlob = function (file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => {
    console.log(reader.result);
    blob = reader.result;
  };
};

const readAsBase64 = function (file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    console.log(reader.result);
    base64 = reader.result;

    showImage("mint-preview", base64);
  };
};

const showImage = (className, src) => {
  const imagePreviewElement = document.getElementsByClassName(className)[0];
  imagePreviewElement.src = src;
  toggleShowHide(imagePreviewElement);
};

const getErc721Minter = () => {
  const parent = createElement("div", "wrapper");

  const pTag = createElement("p", "title");
  const pText = document.createTextNode(`Step1: Mint your NFT with IPFS`);
  pTag.appendChild(pText);

  const nameInput = createInputElement("Token Name", "name");
  const descInput = createInputElement("Description", "description");

  const fileInput = createInputElement("", "file", "file");
  fileInput.accept = "image/*";
  fileInput.onchange = selectFile;

  const imageElement = createElement("img", "image hidden mint-preview");

  const loadingDiv = createElement("div", "center hidden loading");
  loadingDiv.innerText = "Loading...";

  const mintButton = createElement("button", "mint");
  mintButton.innerText = "mint";
  mintButton.onclick = mint;

  const tokenElement = createElement("p", "token hidden");

  parent.append(
    pTag,
    nameInput,
    descInput,
    fileInput,
    imageElement,
    loadingDiv,
    mintButton,
    tokenElement
  );
  return parent;
};

const getErc721Checker = () => {
  const parent = createElement("div", "wrapper checker");

  const pTag = createElement("p", "title");
  const pText = document.createTextNode(`Step2: Get your NFT`);
  pTag.appendChild(pText);

  const tokenIdInput = createInputElement("Token ID", "tokenId");

  const getButton = createElement("button", "get");
  getButton.innerText = "get";
  getButton.onclick = get;

  const imageElement = createElement("img", "image hidden get-preview");

  const nameElement = createElement("p", "name hidden");

  const descriptionElement = createElement("p", "description hidden");

  parent.append(
    pTag,
    tokenIdInput,
    getButton,
    imageElement,
    nameElement,
    descriptionElement
  );

  return parent;
};

const createElement = (element = "div", className) => {
  const div = document.createElement(element);
  if (className) {
    div.className = className;
  }
  return div;
};
const createInputElement = (placeHolder, name, type = "text") => {
  const inpElement = createElement("input");
  inpElement.placeholder = placeHolder;
  inpElement.type = type;
  if (name) {
    inpElement.name = name;
  }
  return inpElement;
};

const renderContents = () => {
  const div = createElement("div", "center");
  const divChild = createElement();
  const erc721Minter = getErc721Minter();

  const erc721Checker = getErc721Checker();

  document.body.appendChild(div);
  div.append(divChild);
  divChild.appendChild(erc721Minter);
  divChild.appendChild(erc721Checker);
};

main();
