import openpyxl
import os

def check_headers():
    xlsx_file = "korea_model_0507.xlsx"
    if not os.path.exists(xlsx_file):
        print(f"Error: {xlsx_file} not found.")
        return

    wb = openpyxl.load_workbook(xlsx_file, data_only=True)
    sheet = wb.active
    
    # Read first 5 rows to see structure
    for i, row in enumerate(sheet.iter_rows(max_row=5, values_only=True)):
        print(f"Row {i+1}: {row}")

if __name__ == "__main__":
    check_headers()
