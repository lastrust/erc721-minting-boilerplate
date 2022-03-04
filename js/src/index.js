import "main.css";
import bunzz from "bunzz-sdk";
import { NFTStorage, File } from "nft.storage";

const globalStorage = {
  handler: null,
  contract: null,
  uploadedFile: {
    fileName: null,
    type: null,
    blob: null,
  },
};

const init = async () => {
  globalStorage.handler = await bunzz.initializeHandler({
    dappId: process.env.JS_DAPP_ID,
    apiKey: process.env.JS_API_KEY,
  });
};

const store = async (name, description, data, fileName, type) => {
  const nftStorage = new NFTStorage({
    token: process.env.JS_APP_NFT_STORAGE_KEY,
  });

  const metadata = await nftStorage.store({
    name,
    description,
    image: new File([data], fileName, { type }),
  });

  return metadata;
};

const setup = async () => {
  try {
    globalStorage.contract = await globalStorage.handler.getContract(
      "NFT (IPFS Mintable)"
    );
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
    const name = document.getElementsByName("name")[0].value;
    const description = document.getElementsByName("description")[0].value;
    const { blob, fileName, type } = globalStorage.uploadedFile;
    const metadata = await store(name, description, blob, fileName, type);
    const inputUrl = metadata.url.replace(/^ipfs:\/\//, "");
    console.log(inputUrl);

    const address = await globalStorage.handler.getSignerAddress();
    const tx = await globalStorage.contract.safeMint(address, inputUrl);
    const receipt = await tx.wait();
    const event = receipt.events[0];
    const tokenId = event.args[2];

    window.alert("Succeeded to mint");
    addTextAndShowElement("token", `Token ID: ${tokenId}`);
  } catch (err) {
    console.error(err);
  } finally {
    toggleShowHideByClassName("mint");
    toggleShowHideByClassName("loading");
    toggleShowHideByClassName("mint-preview");
  }
};

const addTextAndShowElement = (className, text) => {
  document.getElementsByClassName(className)[0].innerText = text;
  toggleShowHideByClassName(className);
};

const get = async () => {
  toggleShowHideByClassName("get");
  try {
    const tokenId = document.getElementsByName("tokenId")[0].value;
    const { data: tokenUri } = await globalStorage.contract.tokenURI(tokenId);
    const url = tokenUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
    const res = await fetch(url);
    const data = await res.json();
    const image = data.image.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
    const name = data.name;
    const description = data.description;
    showImage("get-preview", image);
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
      globalStorage.uploadedFile.type = file.type;
      globalStorage.uploadedFile.fileName = file.name;
    }
  }
};

const readAsBlob = function (file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => {
    console.log(reader.result);
    globalStorage.uploadedFile.blob = reader.result;
  };
};

const readAsBase64 = function (file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    showImage("mint-preview", reader.result);
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

  const nameElement = createElement("p", "name hidden");

  const descriptionElement = createElement("p", "description hidden");

  const imageElement = createElement("img", "image hidden get-preview");

  parent.append(
    pTag,
    tokenIdInput,
    getButton,
    nameElement,
    descriptionElement,
    imageElement
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
