const bookshelfs = [];
const STORAGE_KEY = 'BOOKSHELF_APPS';
const eSaved = 'save-book';
const eRender = 'render-book';
const eSearch = 'search-book';

const dom = {
  searchForm: document.getElementById("searchForm"),
  search: document.getElementById("search"),
	submitForm: document.getElementById("form"),
	title: document.getElementById("title"),
	author: document.getElementById("author"),
	year: document.getElementById("year"),
	isComplete: document.getElementById("isComplete"),
	bookshelf: document.getElementById("uncompleted-bookshelf"),
	completedBookshelf: document.getElementById("completed-bookshelf"),
	snackbar: document.getElementById("snackbar"),
}

function checkStorage() {
	if(typeof(Storage) === undefined) {
		alert("Browser tidak support web storage");
		return false;
	}
	return true;
}

function genId() {
	return +new Date();
}

function genBookObj(id, title, author, year, isComplete) {
	return {
		id,
		title,
		author,
		year,
		isComplete
	}
}

function saveData() {
	if(checkStorage()) {
		const parsed = JSON.stringify(bookshelfs);
		localStorage.setItem(STORAGE_KEY, parsed);
	}
}

function loadDataFromStorage() {
	const serialData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serialData);
	
	if(data !== null) {
		for (const book of data) {
			bookshelfs.push(book);
		}
	}
	
	document.dispatchEvent(new Event(eRender));
}

function findBook(bookId) {
	for (const bookItem of bookshelfs) {
		if(bookItem.id === bookId) {
			return bookItem;
		}
	}
	
	return null;
}

function findBookIndex(bookId) {
	for (const index in bookshelfs) {
		if(bookshelfs[index].id === bookId) {
			return index;
		}
	}
	
	return -1;
}

function makeBook(bookObj) {
	const textTitle = document.createElement("h3");
	textTitle.innerText = bookObj.title;
	
	const textAuthor = document.createElement("p");
	textAuthor.innerText = 
	  `Penulis: ${bookObj.author}`;
	
	const textYear = document.createElement("p");
	textYear.innerText = `Tahun: ${bookObj.year}`;
	
	const item = document.createElement("div");
	item.append(textTitle, textAuthor, textYear);
	
	const moveBtn = document.createElement("button");
	moveBtn.classList.add("move-btn");
	
	moveBtn.addEventListener("click", function() {
		moveBook(bookObj.id, bookObj.isComplete)
	});
	
	const delBtn = document.createElement("button");
	delBtn.classList.add("del-btn");
	
	delBtn.addEventListener("click", function() {
		removeBook(bookObj.id);
	});
	
	const btnItem = document.createElement("div");
	btnItem.append(moveBtn, delBtn);
	
	const container = document.createElement("article");
	container.classList.add("book-item");
	container.setAttribute("id", `book-${bookObj.id}`);
	container.append(item, btnItem);
	
	return container;
}

function addBook() {
  const id = genId();
  
	const bookObj = genBookObj(
	  id,
	  dom.title.value,
	  dom.author.value,
	  dom.year.value,
	  dom.isComplete.checked
	  );
	  
	  bookshelfs.push(bookObj);
	  document.dispatchEvent(new Event(eRender));
	  toast("Buku berhasil ditambahkan..");
	  saveData();
}

function moveBook(bookId, bool) {
	const bookTarget = findBook(bookId);
	
	if(bookTarget == null) return;
	
	bookTarget.isComplete = !bool;
	document.dispatchEvent(new Event(eRender));
	toast("Buku berhasil dipindahkan..");
	saveData();
}

function removeBook(bookId) {
	const bookIndex = findBookIndex(bookId);
	
	if(bookIndex == -1) return;
	
	bookshelfs.splice(bookIndex, 1);
	document.dispatchEvent(new Event(eRender));
	toast("Buku berhasil dihapus..");
	saveData();
}

function searchBook() {
	const query = dom.search.value;
	
	const bookResult = bookshelfs.filter(
	  function(book) {
		  return query ? 
		  book.title.toLowerCase()
		    .includes(query.toLowerCase())
		    : [];
	  });

	return bookResult;
}

document.addEventListener("DOMContentLoaded",
	function() {
		dom.submitForm.addEventListener("submit", 
			function(e) {
		    e.preventDefault();
		    addBook();
		});
			
			if(checkStorage()) {
				loadDataFromStorage();
			}
	});

document.addEventListener(eRender, function() {
	dom.bookshelf.innerHTML = "";
	dom.completedBookshelf.innerHTML = "";
	
	for(const book of bookshelfs) {
	  const bookEl = makeBook(book);
		if(!book.isComplete) {
			dom.bookshelf.append(bookEl);
		} else {
			dom.completedBookshelf.append(bookEl);
		}
	}
});

dom.searchForm.addEventListener("submit", 
  function(ev) {
		 ev.preventDefault();
    let bookResult = searchBook();
    
    dom.bookshelf.innerHTML = "";
   	 dom.completedBookshelf.innerHTML = "";
	
  	for(const book of bookResult) {
	    const bookEl = makeBook(book);
	    if(!book.isComplete) {
			 dom.bookshelf.append(bookEl);
		} else {
			dom.completedBookshelf.append(bookEl);
		}
		toast(`Ini hasil pencarian dari <b>\'${dom.search.value}\'</b>`);
	}
	});
	  

function toast(text) {
	dom.snackbar.innerHTML = text;
	dom.snackbar.classList.add("show");
	
	setTimeout(function() {
		dom.snackbar.classList.remove("show");
	}, 3000);
}




