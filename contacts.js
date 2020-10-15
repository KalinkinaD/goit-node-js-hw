const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}
function getContactById(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) throw err;
    const contact = JSON.parse(data).find(
      (contact) => contact.id === contactId
    );
    console.log(contact);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) throw err;
    const filteredContacts = JSON.parse(data).filter(
      (contact) => contact.id !== contactId
    );
    fs.writeFile(contactsPath, JSON.stringify(filteredContacts), (err) => {
      if (err) throw err;
    });
  });
}

function addContact(name, email, phone) {
  const oldContactList = require(contactsPath);
  const newContactList = [
    ...oldContactList,
    {
      id: uuidv4(),
      name: name,
      email: email,
      phone: phone,
    },
  ];
  fs.writeFile(contactsPath, JSON.stringify(newContactList), (err) => {
    if (err) throw err;
  });
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
