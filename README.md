# Jupyter Cell Selection Extension

A JupyterLab extension that allows you to mark and track selected cells in Jupyter notebooks. When cells are marked, they receive `selected_for_export: true` metadata that persists when the notebook is saved or exported.


## Features

- Adds checkboxes to each cell in your notebooks
- Marks selected cells with `selected_for_export: true` metadata
- Visually highlights selected cells with a blue border
- Metadata persists when notebooks are saved or exported
- Shows tooltips on hover over the checkboxes

## Requirements

- JupyterLab >= 4.0.0
- Python >= 3.9

## Installation

You can install the extension using pip:

```bash
pip install jupyter_cell_selection
```

Or directly from the GitHub repository:

```bash
pip install git+https://github.com/thomaspernet/jupyter_cell_selection.git
```

## Development Installation

To install the extension for development:

```bash
# Clone the repository
git clone https://github.com/thomas_pernet/jupyter_cell_selection.git
cd jupyter_cell_selection

# Install in development mode
pip install -e .

# Link your development version with JupyterLab
jupyter labextension develop . --overwrite

# Build the extension
jlpm build
```

## Usage

1. Open any Jupyter notebook in JupyterLab
2. Notice the checkboxes that appear next to each cell
3. Check the boxes for cells you want to mark
4. Selected cells will be highlighted with a blue border and background
5. The metadata (`selected_for_export: true`) will be added to marked cells
6. When you save the notebook, this metadata is preserved
7. You can use this metadata in other tools or extensions to filter or process marked cells

## Accessing the Metadata

Selected cells will have the `selected_for_export` field set to `true` in their metadata. You can access this programmatically:

```python
# Get all cell metadata from a notebook
import json
with open('your_notebook.ipynb', 'r') as f:
    notebook = json.load(f)

# Print cells that are marked for export
for i, cell in enumerate(notebook['cells']):
    if cell.get('metadata', {}).get('selected_for_export'):
        print(f"Cell {i} is selected for export")
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `jlpm run lint:fix` to format code
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Uninstallation

To remove the extension:

```bash
pip uninstall jupyter_cell_selection
```

## License

This project is licensed under the BSD-3-Clause License - see the LICENSE file for details.