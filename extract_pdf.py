import pdfplumber
import PyPDF2
import sys
import os

def extract_pdf_with_pdfplumber(pdf_path):
    """Extract text using pdfplumber (usually better formatting)"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += f"\n--- Page {page.page_number} ---\n"
                    text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error with pdfplumber: {e}")
        return None

def extract_pdf_with_pypdf2(pdf_path):
    """Extract text using PyPDF2 (backup method)"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page_num, page in enumerate(pdf_reader.pages):
                text += f"\n--- Page {page_num + 1} ---\n"
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error with PyPDF2: {e}")
        return None

def main():
    pdf_path = r"c:\Users\sales\ENFRASYS WEBSITE\enfrasys\assets\references\company profile deck\V1 COMPANY PROFILE.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"PDF file not found: {pdf_path}")
        return
    
    print("Extracting text from PDF...")
    print("=" * 50)
    
    # Try pdfplumber first
    text = extract_pdf_with_pdfplumber(pdf_path)
    
    if not text:
        print("Trying PyPDF2...")
        text = extract_pdf_with_pypdf2(pdf_path)
    
    if text:
        # Save to file
        output_file = r"c:\Users\sales\ENFRASYS WEBSITE\enfrasys\company_profile_extracted.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(text)
        
        print(f"Text extracted successfully!")
        print(f"Saved to: {output_file}")
        print(f"Total characters: {len(text)}")
        
        # Show first 2000 characters as preview
        print("\n" + "=" * 50)
        print("PREVIEW (first 2000 characters):")
        print("=" * 50)
        print(text[:2000])
        print("...")
        
    else:
        print("Failed to extract text from PDF")

if __name__ == "__main__":
    main()
