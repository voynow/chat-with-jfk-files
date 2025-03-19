from typing import List
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def fetch_pdf_links(page_url: str) -> List[str]:
    """
    Scrapes the given page for all PDF links and returns absolute URLs.
    :param page_url: The URL to scrape for PDF files.
    :return: List of absolute PDF file URLs.
    """
    resp = requests.get(page_url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    pdf_urls = []
    for anchor in soup.find_all("a", href=True):
        href = anchor["href"]
        if href.lower().endswith(".pdf"):
            pdf_urls.append(urljoin(page_url, href))
    return pdf_urls

def download_pdfs(pdf_urls: List[str], dest_dir: str) -> None:
    """
    Downloads PDFs from the provided URLs into the specified directory.
    :param pdf_urls: List of PDF file URLs to download.
    :param dest_dir: Local directory to save the PDFs.
    """
    os.makedirs(dest_dir, exist_ok=True)
    for i, url in enumerate(pdf_urls[:300]):
        print(i)
        filename = url.split("/")[-1]
        resp = requests.get(url)
        resp.raise_for_status()
        with open(os.path.join(dest_dir, filename), "wb") as f:
            f.write(resp.content)

def main() -> None:
    """
    Orchestrates scraping the JFK release page for PDF links and downloads them.
    """
    page_url = "https://www.archives.gov/research/jfk/release-2025"
    destination_directory = "/Users/jamievoynow/Desktop/jfk_pdfs_2025/all_files"
    pdf_links = fetch_pdf_links(page_url)
    download_pdfs(pdf_links, destination_directory)

if __name__ == "__main__":
    main()
