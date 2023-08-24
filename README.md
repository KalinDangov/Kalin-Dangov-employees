# Kalin-Dangov-employees
Application that identifies the pair of employees who have worked together on common projects for the longest period of time.

Input data:
  A CSV file with data in the following format:
  EmpID, ProjectID, DateFrom, DateTo


Specific requirements
  1) DateTo can be NULL, equivalent to today
  2) The input data must be loaded to the program from a CSV file
  3) Create an UI:
    The user picks up a file from the file system and, after selecting it, all common
    projects of the pair are displayed in datagrid with the following columns:
    Employee ID #1, Employee ID #2, Project ID, Days worked
  4) More than one date format to be supported, extra points will be given if all date formats
  are supported
