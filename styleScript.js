var style = document.createElement('style');
style.textContent = `
.column-resize-handle {
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: ew-resize;
  z-index: 1;
}
.selected-row {
    background-color: #f0f0f0;
}
.table td, .table th {
  padding: 0.75rem;
  vertical-align: top;
  border: 1px solid #ccc; /* Add this line */
}
.pagination-options label {
    font-weight: bold;
}
.table thead th {
  vertical-align: bottom;
  border: 2px solid #0c6ed0;
  color: black;
}
.pagination-options select {
    padding: 5px;
}
th {
    text-align: center;
}
button {
    background-color: blueviolet;
    color: black;
}
.filter-icon {
    cursor: pointer;
    margin-left: 5px;
}
.group-header {
  background-color: #f1f1f1;
  font-weight: bold;
}

.tableSize {
  margin-left: 10em;
  margin-right: 10em;
  margin-bottom: 8em;
  margin-top: 5em;
  display: flex;
  flex-direction: column;
}
.filter-modal {
    position: absolute;
    border: 1px solid #ccc;
    background-color: white;
    padding: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
span {
    background-color: blueviolet;
    color: fefefe;
    padding-top: 3px;
}
.showing-entry-text {
  font-size: 14px;
  color: fefefe;
  float: right;
  margin-top: 10px;
}
.pagination {
  display: -ms-flexbox;
  display: block;
  padding-left: 0;
  list-style: none;
  border-radius: .25rem;
}
.table td, .table th {
  padding: 0.75rem;
  vertical-align: top;
  border: 1px solid #ccc; /* Add this line */
}

/* Add border lines to the table */
.table {
  border-collapse: collapse;
  border: 1px solid #ccc;
  // background-color: #980707;
font-style: oblique;
// color: antiquewhite;
}
/* CSS for dragged row */
.dragged-row {
  opacity: 0.5;
}
.table-container {
  overflow-x: auto;
}

/* Adjust margin for smaller screens */
.tableSize {
  margin: 2em;
}

/* Make the header cells responsive */
.table thead th {
  white-space: nowrap;
}

/* Make the table take full width on small screens */
.table {
  width: 100%;
}

/* Responsive font size for small screens */
@media (max-width: 768px) {
  .table th,
  .table td {
      font-size: 12px;
  }
}

/* Responsive padding for small screens */
@media (max-width: 576px) {
  .table th,
  .table td {
      padding: 0.5rem;
  }
}
.active-row {
  background-color: #f5f5f5; /* Light gray background */
  color: #333; /* Darker text color */
  font-weight: bold; /* Bold font for better visibility */
}
/* Add more responsive styles as needed */

/* CSS for dragged row */
.dragged-row {
  opacity: 0.5;
}

/* CSS for drop target row */
.drop-target-row {
  border: 2px dashed #007bff;
}
/* CSS for drop target row */
.drop-target-row {
  border: 2px dashed #007bff;
}

/* Add border lines to the header cells */
.table thead th {
  vertical-align: bottom;
  border: 2px solid #0c6ed0;
  // color: antiquewhite;
}
.table {
  flex-grow: 1;
  height: auto;
  max-height: calc(100% - 13em);
  overflow-y: auto;
}
.highlighted-row {
  background-color: #ffff99; /* Yellow background color as an example */
}
.context-menu {
    display: none;
    position: absolute;
    background: #19f4fff2;
    border: 1px solid #ccc;
    list-style: none;
    padding: 0;
}
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}


.context-menu li {
  padding: 5px 10px;
  cursor: pointer;
}
#closeContextMenu {
    float: right;
  }
/* Show the context menu on right-click */
.table-row:hover .context-menu {
  display: block;
}
hr {
    margin-top: 0rem;
    margin-bottom: 0rem;
    border: 0;
      border-top-width: 0px;
      border-top-style: none;
      border-top-color: currentcolor;
    border-top: 3px solid rgba(0,0,0,.1);
  }`;
document.head.appendChild(style);