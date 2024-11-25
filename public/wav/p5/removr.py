""" import os
import re

def remove_numbers_from_filenames(folder_path):
    # List all files in the folder
    for filename in os.listdir(folder_path):
        # Create a new filename by removing numbers
        new_filename = re.sub(r'\d+', '', filename)
        
        # Get the full file paths
        old_file = os.path.join(folder_path, filename)
        new_file = os.path.join(folder_path, new_filename)
        
        # Rename the file
        os.rename(old_file, new_file)
        print(f'Renamed: {old_file} -> {new_file}')

# Example usage
folder_path = 'C:/Users/kroonut/Downloads/BNV_1722675413530'
remove_numbers_from_filenames(folder_path) """



import os
import re

def remove_numbers_and_hyphens_from_filenames(folder_path):
    # List all files in the folder
    for filename in os.listdir(folder_path):
        # Create a new filename by removing numbers and hyphens
        new_filename = re.sub(r'[\d-]+', '', filename)
        
        # Get the full file paths
        old_file = os.path.join(folder_path, filename)
        new_file = os.path.join(folder_path, new_filename)
        
        # Rename the file
        os.rename(old_file, new_file)
        print(f'Renamed: {old_file} -> {new_file}')

# Example usage
folder_path = 'C:/Users/kroonut/Downloads/BNV_1722675413530'
remove_numbers_and_hyphens_from_filenames(folder_path)

