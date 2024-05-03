import requests
from bs4 import BeautifulSoup
from models import Metadata
import ssl
from urllib.request import Request, urlopen


def extract_web_link(url):
    try:
        # Fetch the blog post
        hdr = {"User-Agent": "Mozilla/5.0"}
        req = Request(url, headers=hdr)
        context = ssl.SSLContext(ssl.PROTOCOL_TLS)
        response = urlopen(req, context=context)

        # Parse the HTML content
        soup = BeautifulSoup(response, "html.parser")

        # Extract the title
        title = soup.title.string if soup.title else "No title found"
        description = "No description found"
        image = "No image found"
        # Find all meta tags
        meta_tags = {}
        for tag in soup.find_all("meta"):
            if tag.get("name", "").strip():
                meta_tags[tag.get("name", "").strip()] = tag.get("content", "").strip()
            elif tag.get("property", "").strip():
                meta_tags[tag.get("property", "").strip()] = tag.get(
                    "content", ""
                ).strip()

        for key, value in meta_tags.items():
            if "description" in key:
                description = value
            elif "image" in key and "image:" not in key:
                image = value
        # Extract text content from paragraphs
        text_content = " ".join([p.get_text() for p in soup.find_all("p")])

        # Extract all links
        links = [a["href"] for a in soup.find_all("a", href=True)]

        return Metadata(title, meta_tags, links, text_content, description, image)
        # return {
        #     "title": title,
        #     "image": image,
        #     "description": description,
        #     "meta_tags": meta_tags,
        #     "text_content": text_content,
        #     "links": links,
        # }

    except Exception as e:
        print(f"Error extracting data from {url}: {e}")
        return None


if __name__ == "__main__":

    # Fetch the web page
    url = "http://localhost:3000"
    blog_data = extract_web_link(url)
    if blog_data:
        print("Title:", blog_data.title)
        print("Description:", blog_data.description)
        print("Image:", blog_data.preview_image)
        print("Image:", blog_data.text_content)

    # print("\nMeta tags:")
    # for name, content in blog_data.meta_tags.items():
    #     print(f"{name}: {content}")
    # print("\nText content:", blog_data["text_content"])
    # print("\nLinks:")
    # for link in blog_data["links"]:
    #     print(link)
    # else:
    #     print("Failed to extract blog data.")
