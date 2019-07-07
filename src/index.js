// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded",init);

function init(){
    initPage();
    initForm();
}

function initPage(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(quotes => quotes.forEach(quote => renderQuote(quote)));
}

function renderQuote(quote){
    let quoteLi = document.createElement("li");
        quoteLi.classList.add("quote-card");
    let blockQuote = document.createElement("blockquote");
        blockQuote.classList.add("blockquote");
    let quoteP = document.createElement("p");
        quoteP.innerText = quote.quote;
    let quoteFooter = document.createElement("footer");
        quoteFooter.innerText = quote.author;
    let breakEl = document.createElement("br");
    let likeButton = document.createElement("button");
        likeButton.classList.add("btn-success");
        likeButton.dataset.quoteId = quote.id;
        likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`;
        likeButton.addEventListener("click",likeHandler);
    let deleteButton = document.createElement("button");
        deleteButton.classList.add("btn-danger");
        deleteButton.innerText = "Delete";
        deleteButton.dataset.quoteId = quote.id;
        deleteButton.addEventListener("click",deleteHandler);

    blockQuote.append(quoteP,breakEl,likeButton,deleteButton);
    quoteLi.append(blockQuote);
    getQuoteUl().append(quoteLi);

}

function initForm(){
    getForm().addEventListener("submit",newQuoteHandler)
}

function likeHandler(e){
    fetch("http://localhost:3000/likes",{
        method: "POST",
        headers: {"Content-type" : "application/json"},
        body: JSON.stringify({quoteId: e.currentTarget.dataset.quoteId, createdAt: + new Date()})
    }).then(res => res.json())
    .then(newLike => {
        console.log(newLike);
        debugger
    });
}

function deleteHandler(e){
    debugger
    e.currentTarget.parentElement.parentElement.remove();
    fetch("http://localhost:3000/quotes/"+e.currentTarget.dataset.quoteId,{
        method: "DELETE"
    })
    .then(res => res.json())
    .then(console.log)
}

function newQuoteHandler(e){
    e.preventDefault();
    if (getNewQuote()!== "" && getNewAuthor()!==""){
        let newQuote = {quote: getNewQuote(),
            author: getNewAuthor(),
            };
        fetch("http://localhost:3000/quotes",{
            method: "POST",
            headers: {"Content-type" : "application/json"},
            body: JSON.stringify(newQuote)
        })
        .then(res => res.json())
        .then(newQuote => {
            newQuote.likes = [];
            renderQuote(newQuote);
            
        });
    }else{
        alert("Invalid input.")
    }
}

function getQuoteUl(){
    return document.getElementById("quote-list");
}

function getForm(){
    return document.getElementById("new-quote-form");
}

function getNewQuote(){
    return document.getElementById("new-quote").value;
}

function getNewAuthor(){
    return document.getElementById("author").value;
}