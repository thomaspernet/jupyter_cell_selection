import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { IDisposable } from '@lumino/disposable';
/**
 * Cell Selection Extension that adds checkboxes to cells for selection
 */
class CellSelectionExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  constructor(tracker: INotebookTracker) {
    // tracker is not used in this class but keeping the parameter
    // for potential future use
  }

  createNew(panel: NotebookPanel): IDisposable {
    // Add checkbox to each cell
    this.addCheckboxesToCells(panel);
    
    // Add visual indicator when cells have the metadata
    this.addCellMetadataListener(panel);

    // Track cell changes
    panel.content.model?.cells.changed.connect(() => {
      // When cells change (add/remove), update checkboxes
      this.addCheckboxesToCells(panel);
    });

    // Track disposal state
    let isDisposed = false;
    
    return {
      dispose: () => {
        if (!isDisposed) {
          // Clean up event listeners if needed
          isDisposed = true;
        }
      },
      get isDisposed(): boolean {
        return isDisposed;
      }
    };
  }

  private addCheckboxesToCells(panel: NotebookPanel): void {
    console.log('Adding checkboxes to cells');
    const notebook = panel.content;
    
    notebook.widgets.forEach((cell: Cell) => {
      // Check if checkbox already exists to avoid duplicates
      if (!cell.node.querySelector('.cell-selection-checkbox')) {
        // Create checkbox container with tooltip functionality
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'cell-selection-container';
        checkboxContainer.style.position = 'absolute';
        checkboxContainer.style.left = '5px';
        checkboxContainer.style.top = '5px';
        checkboxContainer.style.zIndex = '100';
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'cell-selection-checkbox';
        
        // Create custom tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'cell-selection-tooltip';
        tooltip.textContent = 'Mark for Chat';
        
        // Set initial state from metadata
        if (cell.model) {
          const selectedForExport = cell.model.getMetadata('selected_for_export');
          checkbox.checked = selectedForExport === true;
        }
        
        
        // Handle checkbox change
        checkbox.addEventListener('change', () => {
          if (cell.model) {
            if (checkbox.checked) {
              cell.model.setMetadata('selected_for_export', true);
              cell.node.setAttribute('data-selected-for-export', 'true');
            } else {
              cell.model.deleteMetadata('selected_for_export');
              cell.node.removeAttribute('data-selected-for-export');
            }
            console.log(`Cell marked for export: ${checkbox.checked}`);
          }
        });
        
        
        // Add checkbox and tooltip to container
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(tooltip);
        
        // Add container to cell
        const headerArea = cell.node.querySelector('.jp-Cell-inputArea');
        if (headerArea) {
          headerArea.insertBefore(checkboxContainer, headerArea.firstChild);
        } else {
          cell.node.insertBefore(checkboxContainer, cell.node.firstChild);
        }
      }
    });
  }

  private addCellMetadataListener(panel: NotebookPanel): void {
    // Initial styling for cells with metadata
    this.updateCellStyles(panel);

    // Update styles when notebook changes
    panel.content.model?.cells.changed.connect(() => {
      this.updateCellStyles(panel);
    });
    
    // Also hook into context saving to ensure metadata is preserved
    panel.context.saveState.connect((_, state) => {
      if (state === 'started') {
        this.updateCellStyles(panel);
      }
    });
  }

  private updateCellStyles(panel: NotebookPanel): void {
    panel.content.widgets.forEach((cell: Cell) => {
      if (cell.model && cell.model.metadata) {
        const selectedForExport = cell.model.getMetadata('selected_for_export');
        const isMarked = selectedForExport === true;
        
        // Update the cell's data attribute for styling
        if (isMarked) {
          cell.node.setAttribute('data-selected-for-export', 'true');
        } else {
          cell.node.removeAttribute('data-selected-for-export');
        }
        
        // Also update the checkbox if it exists
        const checkbox = cell.node.querySelector('.cell-selection-checkbox') as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = isMarked;
        }
      }
    });
  }
}

/**
 * Initialization data for the cell-selection-extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'cell-selection-extension:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab extension cell-selection-extension is activated!');

    // Create the extension
    const extension = new CellSelectionExtension(notebookTracker);
    
    // Add it to the notebook factory
    app.docRegistry.addWidgetExtension('Notebook', extension);
  }
};

export default plugin;