const arr = [
  { "name": "Cloudflare Making an Impact", "url": "https://blog.cloudflare.com/introducing-htmlrewriter/" },
  { "name": "Make Sure You Vote", "url": "https://www.usa.gov/how-to-vote" }, 
  { "name": "What I'm Doing Right Now", "url": "https://memegenerator.net/img/instances/81248431/working-hard-af-brandon-you-the-real-mvp.jpg" }
]

const socials = [
  { "url": "https://www.linkedin.com/in/brandonjfong", "icon": "https://simpleicons.org/icons/linkedin.svg" },
  { "url": "https://www.github.com/BrandonFong1997", "icon": "https://simpleicons.org/icons/github.svg" },
  { "url": "https://www.instagram.com/flying.fong/", "icon": "https://simpleicons.org/icons/instagram.svg" } 
]

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  element(element) {
    for (var i = 0; i < this.links.length; i++) {      
      var a = '<a href="' + this.links[i].url + '">' + this.links[i].name + '</a>'
      element.append(a, {html: true}); 
    }
  }
}

class SocialsTransformer {
  constructor(socials) {
    this.socials = socials
  }

  element(element) {
    for (var i = 0; i < this.socials.length; i++) {      
      var a = '<a href="' + this.socials[i].url + '">' + '<svg> <image width=35px xlink:href="' + this.socials[i].icon + '"></image> </svg> </a>'
      element.append(a, {html: true}); 
    }
  }
}

addEventListener('fetch', event => {
  const { request } = event

  if (request.method === "GET") {
    return event.respondWith(handleGet(request))
  }
})

async function handleGet(request) {
  if (request.url.includes("/links") == false) {
    const url = 'https://static-links-page.signalnerve.workers.dev'
    const response = await fetch(url);    
    
    // Part 1
    const links = new HTMLRewriter().on('div#links', new LinksTransformer(arr))
      .on('div#profile', { element:  e => e.removeAttribute('style') })
      .on('img#avatar', { element:  e => e.setAttribute('src', 'https://avatarfiles.alphacoders.com/120/120979.jpg') })
      .on('h1#name', { element:  e => e.setInnerContent('Brandon Fong') })
      .transform(response)

    // Part 2
    const social = new HTMLRewriter().on('div#social', { element:  e => e.removeAttribute('style') }).transform(links)
    const final = new HTMLRewriter().on('div#social', new SocialsTransformer(socials))
      .on('title', { element:  e => e.setInnerContent('Brandon Fong') })
      .on('body', { element:  e => e.setAttribute('style', 'background-image: linear-gradient(#33ccff, #ff99cc)') })
      .transform(social)

    return final
  }

  else {
    return new Response(JSON.stringify(arr), {
      headers: { 'content-type': 'JSON' }
    })
  }
}

