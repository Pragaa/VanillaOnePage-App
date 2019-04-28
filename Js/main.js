var page = 0;
var topic = 0;
var prevPage = [];
var prevTopic = [];




/***************/
/* Page Loader */
/***************/
const loader = document.querySelector('#pre-loader');

//this creates a loader for the website in case it takes too long to load
window.addEventListener('load', function(){
  loader.classList.add('hide-loader');
});
//this creates a loader animation if needed in some heavy loading situations;
function loading(){
  setTimeout( function(){
    loader.classList.add('hide-loader');
  } ,300);
}
loading();









/***************/
/* Menu-Slider */
/***************/
const sliderImage = document.querySelector('.slider-image'); 
const carouselSlide = document.querySelector('.carousel-slide'); 
const carouselImg = document.querySelectorAll('.carousel-slide div');
//Buttons
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
//dimensions
var sliderHeight = getComputedStyle(document.querySelector(".carousel-slide")).height;
var size = carouselImg[0].clientWidth;
//Counter
let counter = 1;
//assigns a starting point to touch
let startingX;
let change;

//initiates the slider when the page loads;
carousel(size, counter);
//changes the image once the button is clicked;
nextBtn.addEventListener('click', function next(){
  counter++;
  slideCarousel(size, counter); 
});
//changes the image once the button is clicked;
prevBtn.addEventListener('click', function prev(){
  counter--;
  slideCarousel(size, counter);
});
//fires after the transition finished
carouselSlide.addEventListener("transitionend", function(event) {
  if (counter >= carouselImg.length - 1){
    counter = 1;
    carousel(size, counter);
  } else if ( counter <= 0) {
    counter = carouselImg.length - 2;
    carousel(size, counter);
  }
});
//this function returns the point where the div was clicked
carouselSlide.addEventListener('touchstart', function(e){
  return startingX = e.touches[0].clientX;
});
//this function returns the change value that was scrolled
carouselSlide.addEventListener('touchmove', function(e){
  let moved = e.touches[0];
  return change = startingX - moved.clientX; 
})
//this function changes the image according to the value changed
carouselSlide.addEventListener('touchend', function(e){
  if (change >= 10 ){
    counter++;
    slideCarousel(size, counter);
  } else {
    counter--;
    slideCarousel(size, counter);
  }
});

/*  Functions  */
function carousel(size, counter){
  carouselSlide.style.transition = 'none';
  carouselSlide.style.transform = `translateX(${+(-size * counter)}px)`;
}
function slideCarousel(size, counter){
  carouselSlide.style.transition = 'transform 1s ease-in-out';
  carouselSlide.style.transform = `translate3d(${+(-size * counter)}px, 0 ,0)`;
}
setInterval(function(){
  counter++;
  slideCarousel(size, counter);
}, 7000);






window.onpopstate = function() {

  var siteHash = location.hash;
  var thenum = Array.from(siteHash.replace( /^\D+/g, '')); 
  
  switch(location.hash) {
      case `#${thenum[0]}${thenum[1]}hsh`:
        changePage(thenum[0],thenum[1]); 
        break
      default:
        location.replace("/")
  }
}














/***************/
/* Menu-mobile */
/***************/
const mobileMenuBtn = document.querySelector('.menu-mobile-toggle');
const mobileMenu = document.querySelector('.menu-mobile-dropdown');
const mobileAccordion = document.querySelector('.menu-mobile-dropdown .menu-mobile-accordion');
const mobileAccordionHeaders = mobileAccordion.querySelectorAll('.menu-accordion-header');
const desktopMenu = document.querySelectorAll('.menu-desktop-main div');
const mobileMenuLanguage = document.querySelector('.menu-mobile-languages');
const mobileMenuTopics = document.querySelector('.menu-mobile-topics');


mobileMenuBtn.addEventListener('click', function(e){
  //this changes the display of the menu so it shows up when the hamburger is clicked
  mobileMenu.classList.toggle('mobile-dropdown--open');
  // this adds the class that allows for the hamburger logo to rotate
  mobileMenuBtn.firstElementChild.classList.toggle('menu-hamburger-open'); 
})


mobileAccordion.addEventListener('click', function(e){
  //this defines the closest div with the class specified inside the eventlistener
  let itemHeader = e.target.closest('.menu-accordion-header');
  // this runs only if the div is clicked and not the siblings
  if (itemHeader != null) {   

    //this adds the class open to the sibling element of that div
    itemHeader.nextElementSibling.classList.toggle('accordion-open');
    //this fires a function that removes the class from any other siblings
    toggleOtherItems(itemHeader);

    //this makes an array from the next sibling elements
    let itemContent = itemHeader.nextElementSibling.querySelectorAll('p');
    //for each of the subtopics it creates an event listener that changes the pages
    for(let i = 0; i < itemContent.length; i++ ){
      let item = itemContent[i];

      item.addEventListener('click', function(e){
        let j = Array.from(mobileAccordionHeaders).indexOf(itemHeader);
        
        //this is where the event listener performs all the changes on the page
        mobileMenu.classList.remove('mobile-dropdown--open');
        itemHeader.nextElementSibling.classList.remove('accordion-open');
        mobileMenuBtn.firstElementChild.classList.remove('menu-hamburger-open');
        mobileMenuBtn.firstElementChild.classList.add('menu-hamburger-change');

        //this checks to see if the page clicked is the current page
        if (page === j && topic === i){        
          //this changes the top menu in mobile when pages are changed
          clearMenuMobile(page, topic, itemContent);
        } else {
          prevPage.push(page);
          prevTopic.push(topic);     
          page = Array.from(mobileAccordionHeaders).indexOf(itemHeader);
          topic = i;
          //this changes the top menu in mobile when pages are changed
          clearMenuMobile(page, topic, itemContent);
          window.location.hash = `#${page}${topic}hsh`
        }
      })
    };
  } 
})
function toggleOtherItems(itemHeader){
  Array.from(mobileAccordionHeaders).forEach( function(header){
    if (header != itemHeader) {
      header.nextElementSibling.classList.remove('accordion-open');
    }
  })
}



//this function is responsible for the menu in mobile to change when diferent pages are clicked
function clearMenuMobile(page, topic, pageTopics){
  //this makes the slider on top slider invisible
  sliderImage.setAttribute('style', "display: none;");
  //this makes the language mobile menu invisible
  mobileMenuLanguage.setAttribute('style', "display: none;");
  //this makes the topics mobile menu become visible
  mobileMenuTopics.setAttribute('style', "display: flex;");
  //this clears the mobile menu topics
  mobileMenuTopics.innerHTML = "";

  for (let j = 0; j < pageTopics.length; j++ ){
    let menuTopicsTag = document.createElement("div");
      menuTopicsTag.innerHTML = `` 
      mobileMenuTopics.appendChild(menuTopicsTag);

      if(j == topic){
        menuTopicsTag.setAttribute('style', `background-image: url(./img/page-sliders/slider${page}${topic}1.jpg); border-radius: 100px; background-color: white;`);     
      }
      // this is the event listener for each different sub menu button
      menuTopicsTag.addEventListener('click', function(){
        
      if (topic === j) {} else {
        prevPage.push(page);
        prevTopic.push(topic); 
        topic = j;
        window.location.hash = `#${page}${j}hsh`
      }     
    })
  };

  //this inserts the return button in mobile if the page is contacts
  if (pageTopics.length === 0) {
    let menuTopicsReturn = document.createElement("p");
      menuTopicsReturn.innerHTML = `` 
      mobileMenuTopics.appendChild(menuTopicsReturn);
    menuTopicsReturn.addEventListener('click', function(){
    returnPage();
    }) 
  }
  

}

























/****************/
/* Menu-desktop */
/****************/
//this atributes a number in an array to each button in the desktop menu
for(let i=0; i < desktopMenu.length; i++){
  let desktopButton = desktopMenu[i];
  let desktopSubButton = desktopButton.querySelectorAll('li');
 

  //this is the top menu and when clicked it gives the first topic on each page
  desktopButton.addEventListener('click', (e) => {
    
    //this checks if the top button clicked is the same page and if so doesn't add it to the pages visited
    if (page === i && topic === 0){} else if (page === 6 ) {
      page = i;
      topic = 0;
      window.location.hash = `#${page}${topic}hsh`
      //changePage(page, topic);
    } else {
      prevPage.push(page);
      prevTopic.push(topic);
      page = i;
      topic = 0;
      window.location.hash = `#${page}${topic}hsh`
    }
  })

  //this atributes a number in an array to each submenu and adds an event listener to each button
  for(let j=0; j < desktopSubButton.length; j++){
    //this adds an event listener to each submenu button that sets the current page and topic
    desktopSubButton[j].addEventListener('click', function(e){
      e.stopPropagation();
      // page and topic will be equal to the button clicked
      
      if (page === i && topic === j){} else {
        prevPage.push(page);
        prevTopic.push(topic);
        page = i
        topic = j;
        //this will set the page acording to the clicked button
        window.location.hash = `#${page}${topic}hsh`
      }  
    })
  } 
}

/*********************/
/* Side-Menu-desktop */
/*********************/
function desktopSideMenu(page,topic, currentTopic){
  let topMenu = desktopMenu[page].querySelector('ul').querySelectorAll('li');
  let sideMenu = currentTopic.querySelector('.information-four');
  
  if(sideMenu !== null){  
    sideMenu.innerHTML = "";;
    for(let i = 0; i<topMenu.length; i++){
      let sideMenuText = topMenu[i].innerHTML; 
      var sideTag = document.createElement("p");
      sideTag.innerHTML = `${sideMenuText}<span>a</span>`
      sideMenu.appendChild(sideTag);

      if( topic == i){
        sideTag.setAttribute('style', "font-size: 16px; text-decoration:underline;");
        sideTag.querySelector('span').setAttribute('style', "font-size: 18px;");
      }

      sideTag.addEventListener('click', function(){

        if (topic === i) {} else {
          prevPage.push(page);
          prevTopic.push(topic); 
          topic = i;
          window.location.hash = `#${page}${i}hsh`
        }
      })
    }   
  }
}




















/*************/
/*   Pages   */
/*************/
const pages = document.querySelectorAll('#pages section');


//this function redirects the user when he clicks on any buttons or images
function redirectPage(targetPage, targetTopic){
  let mobileDisplay = document.querySelector('.menu-mobile');
  //this gets the css property of the mobile menu to determine if the website is in mobile or desktop
  let mobileCheck = mobileDisplay.currentStyle ? mobileDisplay.currentStyle.display : getComputedStyle(mobileDisplay, null).display;
 
  if (targetPage === page && targetTopic === topic) {} else { 
    prevPage.push(page);
    prevTopic.push(topic); 
    page = targetPage;
    topic = targetTopic;

    //if the property is equal to flex it's in mobile
    if(mobileCheck == 'flex'){
    mobileMenu.classList.remove('mobile-dropdown--open');
    mobileMenuBtn.firstElementChild.classList.remove('menu-hamburger-open');
    mobileMenuBtn.firstElementChild.classList.add('menu-hamburger-change');

    //this changes the top menu in mobile when pages are changed
    clearMenuMobile(targetPage, targetTopic, desktopMenu[targetPage].querySelectorAll('li') ) 
    }
    window.location.hash = `#${targetPage}${targetTopic}hsh`
  }
}





function changePage(page, topic){
  
  //this defines which page has been selected
  let currentPage = pages[page]
  //this changes the current page displayed
  Array.from(pages).forEach( (page) => (page !== currentPage) ? page.setAttribute("style", "order: 0; height: 0px;") : page.setAttribute("style", "order: -1; height: auto;"));

  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

  //this gets all the topics in the current page
  let topics = currentPage.querySelectorAll('#topic');
  //this defines  which topic has been selected
  let currentTopic = topics[topic];

  if(currentTopic !== undefined){
    //this checks if theres a slider inside the topic and creates it's variables
    let pageSlide = currentTopic.querySelector('.excursons-two .excursons-two-slider');
    let imgSlide = currentTopic.querySelectorAll('.excursons-two-slider div');
    let DesktopSlide = currentTopic.querySelectorAll('.excursons-four div');

    //this creates a foreach loop for the divs and changes the css properties acordingly
    Array.from(topics).forEach( (topic) => (topic !== currentTopic) ? topic.setAttribute("style" , "display: none" ) : topic.setAttribute("style" , "display: flex" ));

    //if there's a slider it runs a function that activates it
    if(imgSlide[0] !== undefined){  
      pageSlider(pageSlide, imgSlide, DesktopSlide);
    } else if(topics.length > 1) {
      desktopSideMenu(page, topic, currentTopic)
    }
  }
 
  let mobileDisplay = document.querySelector('.menu-mobile');
  //this gets the css property of the mobile menu to determine if the website is in mobile or desktop
  let mobileCheck = mobileDisplay.currentStyle ? mobileDisplay.currentStyle.display : getComputedStyle(mobileDisplay, null).display;
  mobileCheck == 'flex' ? clearMenuMobile(page, topic, desktopMenu[page].querySelectorAll('li')) : null;
}



function returnPage() {
  let previousPage = prevPage.pop()
  let previousTopic = prevTopic.pop()
  
  if (previousPage === 0 && previousTopic === 0) {
    window.location.reload();
  } else {
    page = previousPage;
    topic = previousTopic;
    window.location.hash = `#${previousPage}${previousTopic}hsh`
  }
}






















/*******************/
/* Pages accordion */
/*******************/
const pageAccordion = document.querySelectorAll('.excursons-three .accordion-button');

Array.from(pageAccordion).forEach(function(element){
  element.addEventListener('click', function(e){   
    element.nextElementSibling.classList.toggle('accordion-content-open');
    element.classList.toggle('active');
    disableOtherHeaders(element)
  })
});
function disableOtherHeaders(button){
  Array.from(pageAccordion).forEach(function(element){
    if (button != element) {
      element.nextElementSibling.classList.remove('accordion-content-open');
      element.classList.remove('active');
    }
  })
};





















/****************/
/* Contact Form */
/****************/
const formButton = document.querySelector('.page6 .form-input .submit');

formButton.addEventListener('click', function(event){
  
  let name = document.querySelector('.page6 .form-input .name').value;
  let country = document.querySelector('.page6 .form-input .country').value;
  let email = document.querySelector('.page6 .form-input .email').value;
  let message = document.querySelector('.page6 .form-input #message').value;
  let statusElm = document.querySelector('.page6 .form-input .status');
  statusElm.innerHTML = "";

  //this checks if the name property is valid
  if(name.length >= 3){
    document.querySelector('.page6 .form-input .name').setAttribute('style', "border-color: green; ")

    //this checks if the country property is valid
    if(country.length > 0){
      document.querySelector('.page6 .form-input .country').setAttribute('style', "border-color: green;");

      //this checks if the email is valid
      if ( email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        document.querySelector('.page6 .form-input .email').setAttribute('style', "border-color: green;");

        //this verifies if the message is valid
        if(message.length >= 10){
          document.querySelector('.page6 .form-input #message').setAttribute('style', "border-color: green;");

        } else {
          document.querySelector('.page6 .form-input #message').setAttribute('style', "border-color: red;")
          statusElm.innerHTML += '<div style="color: red;">Please write a message</div>';
          event.preventDefault();
        }
      } else {   
        document.querySelector('.page6 .form-input .email').setAttribute('style', "border-color: red;");
        statusElm.innerHTML += '<div style="color: red;">Please provide a valid email</div>';
        event.preventDefault();
      }
    } else {
      document.querySelector('.page6 .form-input .country').setAttribute('style', "border-color: red;");
      statusElm.innerHTML += '<div style="color: red;">Country should be specified</div>';
      event.preventDefault();
    }
  } else {
    document.querySelector('.page6 .form-input .name').setAttribute('style', "border-color: red;");
    statusElm.innerHTML += '<div style="color: red;">Name needs to cointain more than 3 letters</div>';
    event.preventDefault();
  }

})
















/*********************/
/* Excursions-Slider */
/*********************/
function pageSlider(pageSlide, imgSlide, DesktopSlide){
  //the counter starts as 1 every time it's loaded
  let slideCounter = 1;
  //the image size is checked every time the page is changed
  let imgSize = imgSlide[0].clientWidth;

  let pageSlideStartingX;
  let pageSlideChange;

  //loads every time the page is changed
  pageCarousel(pageSlide, imgSize, slideCounter)

  //fires after the transition finished
  pageSlide.addEventListener("transitionend", function(event) {
    if (slideCounter >= imgSlide.length - 1){
      slideCounter = 1;
      pageCarousel(pageSlide, imgSize, slideCounter);
    } else if ( slideCounter <= 0) {
      slideCounter = imgSlide.length - 2;
      pageCarousel(pageSlide, imgSize, slideCounter);
    }
  });
  //this function returns the point where the div was clicked
  pageSlide.addEventListener('touchstart', function(e){
    return pageSlideStartingX = e.touches[0].clientX;
  });
  //this function returns the change value that was scrolled
  pageSlide.addEventListener('touchmove', function(e){
  let moved = e.touches[0];
  return pageSlideChange = pageSlideStartingX - moved.clientX; 
  })
  //this function changes the image according to the value changed
  pageSlide.addEventListener('touchend', function(e){
  if (pageSlideChange >= 10 ){
    slideCounter++;
    pageCarouselSlide(pageSlide, imgSize, slideCounter);
  } else {
    slideCounter--;
    pageCarouselSlide(pageSlide, imgSize, slideCounter);
  }
  });

// this defines the array from the div underneath the slider in desktop;
var imgDesktopSlide = Array.from(DesktopSlide);

//this adds an event listner on click that changes the image displayed
for (let j = 0; j < imgDesktopSlide.length; j++){
  imgDesktopSlide[j].addEventListener('click', function(e){
    pageCarouselSlide(pageSlide, imgSize, j+1);
  })
}

}

//this adjusts the 
function  pageCarousel(pageSlide, size, counter){
  pageSlide.style.transition = 'none';
  pageSlide.style.transform = `translateX(${+(-size * counter)-(20*counter)}px)`;
}

function pageCarouselSlide(pageSlide, size, counter){
  pageSlide.style.transition = 'transform 1s ease-in-out';
  pageSlide.style.transform = `translateX(${+(-size * counter)-(20*counter)}px)`;
}

















/******************/
/* Footer-desktop */
/******************/
const footerServicesButtons = document.querySelectorAll('.footer .footer-services ul');
const footerInformationButtons = document.querySelectorAll('.footer .footer-information ul');

for(let i=0; i < footerServicesButtons.length; i++){
  let footerService = footerServicesButtons[i];
  let footerSubService = footerService.querySelectorAll('li');

  for(let j=0; j < footerSubService.length; j++){
    
    footerSubService[j].addEventListener('click', function(e){
      // page and topic will be equal to the button clicked
      if (page === i+1 && topic === j) {} else {
        prevPage.push(page);
        prevTopic.push(topic); 
        page = i+1;
        topic = j;
        window.location.hash = `#${page}${topic}hsh`
      }
    })
  }
}
for(let i=0; i < footerInformationButtons.length; i++){
  let footerInformation = footerInformationButtons[i];
  
  let footerSubService = footerInformation.querySelectorAll('li');

  for(let j=0; j < footerSubService.length; j++){
    
    footerSubService[j].addEventListener('click', function(e){
       // page and topic will be equal to the button clicked
       if (page === i+4 && topic === j) {} else {
        prevPage.push(page);
        prevTopic.push(topic); 
        page = i+4;
        topic = j;
        window.location.hash = `#${page}${topic}hsh`
      }
    })
  }
}



