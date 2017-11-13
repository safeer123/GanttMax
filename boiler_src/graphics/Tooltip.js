

export class Tooltip{

    constructor(wrapperDiv)
    {
        this.tooltipTable = document.createElement("table");
        wrapperDiv.appendChild(this.tooltipTable);

        this.tooltipTable.setAttribute('class', 'tooltip');
        this.tooltipTable.style.position = "absolute";
        this.tooltipTable.style.zIndex = "1";
        this.tooltipTable.width = 200;
        this.tooltipTable.style.left = "10px";
        this.tooltipTable.style.top = "10px";
    }

    addItem(textValue)
    {
        // Insert a row in the table at the last row
        var newRow = this.tooltipTable.insertRow(this.tooltipTable.rows.length);

        // Insert a cell in the row at index 0
        var newCell  = newRow.insertCell(0);

        // Append a text node to the cell
        var newText  = document.createTextNode(textValue);
        newCell.appendChild(newText);
    }

    showAt(x, y)
    {
        this.tooltipTable.style.left = x + "px";
        this.tooltipTable.style.top = y + "px";
        this.tooltipTable.style.visibility = "visible";
    }

    hide()
    {
        this.tooltipTable.style.visibility = "hidden";
    }

    emptyList()
    {
        while(this.tooltipTable.rows.length > 0) 
        {
            this.tooltipTable.deleteRow(0);
        }
    }


}