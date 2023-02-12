const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
var completed = false;
const storageKey = "BOOKS_LIST";
var isEdited = false;
var bookEdit = {};

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(storageKey);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(storageKey, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function makeBooks(bookObject) {
  const { id, title, author, year, completed } = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;

  const textYear = document.createElement("p");
  textYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textContainer);
  container.setAttribute("id", `todo-${id}`);

  if (completed) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Belum Selesai";
    undoButton.classList.add("green");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("blue");
    editButton.addEventListener("click", function () {
      editTaskFromCompleted(id);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    buttonContainer.append(undoButton, trashButton, editButton);

    container.append(buttonContainer);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerText = "Selesai";
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("blue");
    editButton.addEventListener("click", function () {
      editTaskFromCompleted(id);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    buttonContainer.append(checkButton, trashButton, editButton);

    container.append(buttonContainer);
  }

  return container;
}

function addTaskToCompleted(id /* HTMLELement */) {
  const bookTarget = findBook(id);

  if (bookTarget == null) return;

  bookTarget.completed = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(id /* HTMLELement */) {
  const bookTarget = findBookIndex(id);

  if (bookTarget === -1) return;

  if ((isEdited = false)) {
    alert("Hapus Buku ?");
  }

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(id /* HTMLELement */) {
  const bookTarget = findBook(id);
  if (bookTarget == null) return;

  bookTarget.completed = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editTaskFromCompleted(id) {
  bookEdit = findBook(id);
  if (bookEdit == null) return;
  console.log(bookEdit);

  const bookTitle = document.getElementById("inputBookTitle");
  const bookAuthor = document.getElementById("inputBookAuthor");
  const bookYear = document.getElementById("inputBookYear");

  bookTitle.value = bookEdit.title;
  bookAuthor.value = bookEdit.author;
  bookYear.value = bookEdit.year;

  isEdited = true;
  console.log(isEdited);

  // removeTaskFromCompleted(bookTarget.id);
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    bookTitle,
    bookAuthor,
    bookYear,
    completed
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, completed) {
  return {
    id,
    title,
    author,
    year,
    completed,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function searchBook() {
  console.log("Searching");
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toUpperCase();

  console.log("search value: " + searchTitle);

  var listContainer = document.getElementById("incompleteBookshelfList");
  var bookList = listContainer.getElementsByTagName("article");
  console.log("Length: " + bookList.length);

  for (var i = 0; i < bookList.length; i++) {
    var title = bookList[i].getElementsByTagName("h3")[0];
    var titleValue = title.textContent || title.innerText;
    console.log(titleValue.toUpperCase());
    if (titleValue.toUpperCase().indexOf(searchTitle) > -1) {
      bookList[i].style.display = "";
      console.log("masuk");
    } else {
      bookList[i].style.display = "none";
      console.log("none");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
    submitForm.reset();
    if (isEdited) {
      removeTaskFromCompleted(bookEdit.id);
      isEdited = false;
    }
  });

  const checkbox = document.querySelector("input[name=checkbox]");
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      completed = true;
      console.log(completed);
    } else {
      completed = false;
      console.log(completed);
    }
  });

  const search = document.getElementById("searchBook");

  search.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById(
    "incompleteBookshelfList"
  );
  const listCompleted = document.getElementById("completeBookshelfList");

  // clearing list item
  uncompletedBOOKList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBooks(bookItem);
    if (bookItem.completed) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});
