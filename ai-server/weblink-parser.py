import requests
from bs4 import BeautifulSoup


def extract(url):
    try:
        # Fetch the blog post
        response = requests.get(url)
        response.raise_for_status()

        # Parse the HTML content
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract the title
        title = soup.title.string if soup.title else "No title found"

        # Find all meta tags
        meta_tags = {
            tag.get("name", "").strip().lower(): tag.get("content", "").strip()
            for tag in soup.find_all("meta")
        }

        # Extract text content from paragraphs
        text_content = " ".join([p.get_text() for p in soup.find_all("p")])

        # Extract all links
        links = [a["href"] for a in soup.find_all("a", href=True)]

        return {
            "title": title,
            "meta_tags": meta_tags,
            "text_content": text_content,
            "links": links,
        }

    except Exception as e:
        print(f"Error extracting data from {url}: {e}")
        return None


# Fetch the web page
url = "https://www.kdnuggets.com/2019/01/approaches-text-summarization-overview.html"
blog_data = extract(url)
if blog_data:
    print("Title:", blog_data["title"])
    print("\nMeta tags:")
    for name, content in blog_data["meta_tags"].items():
        print(f"{name}: {content}")
    print("\nText content:", blog_data["text_content"])
    print("\nLinks:")
    for link in blog_data["links"]:
        print(link)
else:
    print("Failed to extract blog data.")
