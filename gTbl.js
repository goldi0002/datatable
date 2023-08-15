var GTable = {};
var pendingRecords_after_tntyk = [];
GTable.attachTable = function(tableSelector, options = {}) {
	try {
		var {
			    sorting = true,
				destroy=true,
				sortDirection = 'desc',
				columns = [],
				_data = [],
				pageSize = 10,
				shortSpec = [],
				columnsResizing = true,
				columnFiltering = true,
				rowSelection = true,
				paginationOptions = true,
				globalSearch = true,
				customPageZise = false,
				headerFilter = false,
				rowFont=true,
				dragAnd_DropRow=true,
				goto_page={
					on:true,
					value:50
				},
				groupByColumn=[],
				noDataAvailabe = {
					enabled: false,
					message: 'No data available.',
					textStyle: {}
				},
				importCsv = {
					enable: false,
					text: 'Import Data',
					textStyle: {}
				},
				showingentry = true,
				totalCount = false,
				languageNoDataAvailabemsg = {
					enable: true,
					container_id: '',
					lang_code: '',
					soingEntr:true,
				},
				OnKeyBoardShortCuts={
				 enable:true,
				 enterPress:{
					on:true,
					colnm_ind:[],
					target:'_blank'
				 }
				},
                rowHighlight={
          enable:true,
                },
                context_menu={
          enable:true,
          buttons:{
            enable:true,
            edit:{
              on:true,
              text:'Edit',
			  tooltip:{
				on:true,
				text:'Edit Row'
			  },
            },
            delete:{
              on:false,
              text:'Delete'
            },
            copyRow:{
              on:true,
              text:'Copy Current(Row)',
              JSONFormat:true,
			  tooltip:{
				on:true,
				text:'Copy Current Row Data'
			  }
            },
            CopyWithHeader:{
              on:true,
              text:'Copy Current(row) with headers',
              JSONFormat:true,
            },
            printRow:{
              on:true,
              text:'Print Current(row)'
            },
            JSONExport:{
              on:true,
              text:'Export Data in JSON format'
            }
         },
                }
		} = options;
		var currentPage = 1;
		var table = document.querySelector(tableSelector);
		if (!table) {
			console.error("Table not found:", tableSelector);
			return;
		}
		if(destroy){
			destroyTable(tableSelector)
		}
		if (languageNoDataAvailabemsg.enable) {
			EnableLocalisation(languageNoDataAvailabemsg.container_id,noDataAvailabe.textStyle,tableSelector,columns,languageNoDataAvailabemsg.lang_code)
		}
		if (noDataAvailabe.enabled === true) {
			if (_data.length === 0) {
				showEmptyTableMessage(tableSelector, translate(selectedLanguage,'noDataAvailable'), columns, noDataAvailabe.textStyle);
			}
		} else {
			if (_data.length === 0) {
				showEmptyTableMessage(tableSelector,translate(selectedLanguage,'noDataAvailable'), columns, noDataAvailabe.textStyle);
			}
		}
		if (!Array.isArray(columns) || columns.length === 0) {
			throw new Error("Columns not found. Please attach columns with the table!");
		}
		if (!Array.isArray(_data) || _data.length === 0) {
			throw new Error("Invalid data!");
		}
		addPaginationContainer(tableSelector);
		if (sorting) {
			addSortableColumns(table, shortSpec, columns, sortDirection, currentPage, pageSize, _data, tableSelector, showingentry);
		}
		if (columnsResizing) {
			addColumnResizing(tableSelector, columns);
		}
		if (columnFiltering) {
			addColumnFiltering(tableSelector, columns, _data);
		}
		if (headerFilter && columnFiltering == false) {
			addDataColumnToTableHeading(tableSelector, table, columns);
			addFilterIcons(table, columns, tableSelector);
		}
		var totalPages = Math.ceil(_data.length / pageSize);
		updateTableChunk(tableSelector, _data, columns, currentPage, pageSize);
		updatePaginationControls(tableSelector, currentPage, totalPages, _data, pageSize, columns, showingentry,groupByColumn,selectedLanguage);
		var totalRecordsCountDiv = '';
		if (totalCount) {
			totalRecordsCountDiv = document.createElement('div');
			totalRecordsCountDiv.classList.add('total-records-count');
			table.parentNode.appendChild(totalRecordsCountDiv);
		}
		if (paginationOptions || goto_page.on) {
			if(goto_page.on===false && paginationOptions!=true){
                     throw new Error("please enable goto page for working eith this")
			}else if(paginationOptions){
				addPaginationOptions(table, pageSize, tableSelector, _data, columns, totalRecordsCountDiv, customPageZise, showingentry,goto_page,groupByColumn,
					languageNoDataAvailabemsg.lang_code?languageNoDataAvailabemsg.lang_code:'en');
			}
		}
		// if(goto_page.on){
		// 	addPaginationOptions(table, pageSize, tableSelector, _data, columns, totalRecordsCountDiv, customPageZise, showingentry,goto_page,groupByColumn);
		// }
		if (globalSearch) {
			addGlobalSearch(tableSelector, columns, _data, pageSize, showingentry, currentPage, 
				pageSize, totalRecordsCountDiv,groupByColumn,languageNoDataAvailabemsg.lang_code?languageNoDataAvailabemsg.lang_code:'en'
				,languageNoDataAvailabemsg.soingEntr);
		}
		if (rowSelection) {
			addRowSelection(table);
		}
		if(OnKeyBoardShortCuts.enable){
			enableKeyboardShortcuts(tableSelector,OnKeyBoardShortCuts.enterPress.colnm_ind,
				OnKeyBoardShortCuts.enterPress.target,OnKeyBoardShortCuts.enterPress.on)
		}
    if(rowHighlight.enable|| dragAnd_DropRow){
      findRows_addClass(dragAnd_DropRow,tableSelector);
    }
    if(context_menu.enable){
      contextMenu_workProgrss(context_menu.buttons.edit?context_menu.buttons.edit:'',
	    context_menu.buttons.delete?context_menu.buttons.delete:'',
        context_menu.buttons.copyRow?context_menu.buttons.copyRow:'',
		context_menu.buttons.CopyWithHeader?context_menu.buttons.CopyWithHeader:'',
        context_menu.buttons.printRow?context_menu.buttons.printRow:'',
		context_menu.buttons.JSONExport?context_menu.buttons.JSONExport:'',
		languageNoDataAvailabemsg.lang_code?languageNoDataAvailabemsg.lang_code:'en');
      showContextFirstStep(table,context_menu.buttons.CopyWithHeader,context_menu.buttons.copyRow,tableSelector,columns)
    }
		if (importCsv.enable) {
			importCSVFile();
		}
	} catch (error) {
		console.log(error + " occurred");
	}
};
function destroyTable(tableSelector) {
    var table = document.querySelector(tableSelector);
    if (table) {
        // Remove event listeners and other resources
        var tbody = table.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = ''; // Clear the table body
        }
		var paginationa_Option=document.querySelector("pagingOptions");
		if(paginationa_Option){
			paginationa_Option.innerHTML='';
		}
		var psgination=document.querySelector("pagination");
		if(psgination){
			psgination.innerHTML='';
		}
		var shoring_entery_test=document.querySelector("showing-entry-text");
		if(shoring_entery_test){
			shoring_entery_test.innerHTML='';
		}
		var totalRecordsCount=document.querySelector("total-records-count");
		if(totalRecordsCount){
		  totalRecordsCount.innerHTML='';
		}
    } else {
        console.warn('Table not found.');
    }
}
function importCSVFile(){
	var impBtn = document.createElement("div");
	impBtn.classList.add("import-buttons");
	var inputcsv = document.createElement("input");
	inputcsv.setAttribute('type', 'file');
	inputcsv.setAttribute('id', 'importInput');
	inputcsv.setAttribute('accept', '.csv');
	var impButton = document.createElement("button");
	impButton.setAttribute('id', 'importButton');
	impButton.classList.add('btn', 'btn-outline-primary');
	if (importCsv.text != '') {
		impButton.innerText = importCsv.text;
	}
	if (importCsv.textStyle != null && importCsv.textStyle != "" && importCsv.textStyle.count > 0) {
		Object.assign(impButton.style, textStyle);
	}
	impBtn.appendChild(inputcsv);
	impBtn.appendChild(impButton);
	var parentElement = document.getElementById('pselect');
	parentElement.insertAdjacentElement('afterend', impBtn);
	document.getElementById('importButton').addEventListener('click', function() {
		document.getElementById('importInput').click();
	});
	document.getElementById('importInput').addEventListener('change', function(event) {
		var file = event.target.files[0];
		if (file) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var contents = e.target.result;
				var data = parseCSV(contents);
				updateTableWithData(data, tableSelector);
			};
			reader.readAsText(file);
		}
	});
}
function showContextFirstStep(table,cpWhd,_copRow,tableSelector,columns){
  var contextMenu = document.getElementById('contextMenu');
  var selectedRow;
  var rowData = [];
  var rowData_header = [];
  table.addEventListener('contextmenu', function (e) {
   e.preventDefault();
   selectedRow = e.target.closest('tr');
    showContextMenu(e.clientX, e.clientY,contextMenu);
    var cells = selectedRow.getElementsByTagName('td');
    for (var i = 0; i < cells.length; i++) {
      rowData.push(cells[i].textContent);
    }
    if(cpWhd.text!='' && cpWhd.on){
      var headerCells = document.querySelectorAll('thead th');
      for (var i = 0; i < headerCells.length; i++) {
        rowData_header.push(headerCells[i].textContent);
      }
      var cells = selectedRow.getElementsByTagName('td');
      for (var i = 0; i < cells.length; i++) {
        rowData_header.push(cells[i].textContent);
      }
    }
  });
  contextMenu.addEventListener('click', function (e) {
    var action = e.target.id;
    if (action === 'edit_bTableBtn') {
         
    } else if (action === 'delete_bTableBtn') {
         
    }else if(action==='cropRow_'){
      var rowDataString='';
      if(_copRow.JSONFormat){
        var rowDataJson = JSON.stringify(rowData, null, 2);
        copyToClipboard(rowDataJson);
      }else{
        rowDataString = rowData.join('\t');
        copyToClipboard(rowDataString);
      }
    }else if(action==='cropRow_Header'){
      var rowDataString='';
      if(cpWhd.JSONFormat){
        var rowDataJson = JSON.stringify(rowData_header, null, 2);
        copyToClipboard(rowDataJson);
      }else{
        rowDataString=rowData_header.join('\t');
        copyToClipboard(rowDataString);
      }
    }else if(action==='Print_row'){
      var printWindow = window.open('', '_blank');
      printWindow.document.write('<pre>' + JSON.stringify(rowData, null, 2) + '</pre>');
      printWindow.document.close();
      printWindow.print();
    }else if(action==='exportJsonBtn_e'){
      var exportJsonBtn=document.getElementById('exportJsonBtn_e');
      exportJsonBtn.addEventListener('click', exportTableDataToJson(tableSelector,columns));
    }
    contextMenu.style.display = 'none';
  });
}
function showContextMenu(x, y,contextMenu) {
  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';
  contextMenu.style.display = 'block';
}
function contextMenu_workProgrss(edit,_del,_cpR,_cpWh,Pn_row,exportJson,selectedLanguage) {
 var contextMenu = document.createElement('ul');
  var editItem='';
  var deleteItem='';
  var copyRowItem='';
  var copyRowItemWithHeader='';
  var Print_rowItem='';
	contextMenu.id = 'contextMenu';
	contextMenu.className = 'context-menu';
  var closeButton = document.createElement('li');
  closeButton.id = 'closeContextMenu';
  closeButton.innerHTML = '&#10006;'; // Close symbol (X)
  contextMenu.appendChild(closeButton);
  if(edit.on && edit.text!=''){
   if(edit.tooltip.on && edit.tooltip.text!=''){
	editItem = document.createElement('li');
    editItem.id = 'edit_bTableBtn';
    editItem.classList.add('tooltip'); // Add tooltip class
    editItem.setAttribute('data-tooltip', edit.text); // Set tooltip text
    editItem.textContent = edit.text + '✂️';
    contextMenu.appendChild(editItem);
    contextMenu.appendChild(document.createElement('hr'));
   }else{
	editItem = document.createElement('li');
    editItem.id = 'edit_bTableBtn';
    editItem.textContent = edit.text;
    contextMenu.appendChild(editItem);
    contextMenu.appendChild(document.createElement('hr'));
   }
  }
  if(_del.on && _del.text!='' &&_del.on!=undefined &&_del.text!=undefined){
    deleteItem = document.createElement('li');
    deleteItem.id = 'delete_bTableBtn';
    deleteItem.textContent = _del.text;
    contextMenu.appendChild(deleteItem);
  }
  if(_cpR.on && _cpR.text!=''){
    try{
		if(_cpR.tooltip.on && _cpR.tooltip.text!=''&&_cpR.tooltip.text!=undefined){
			try{
				var editContainer = document.createElement('div');
				editContainer.className = 'tooltip';
				copyRowItem=document.createElement('li');
			    copyRowItem.id='cropRow_';
			    copyRowItem.textContent=_cpR.text +'✂️';
				editContainer.appendChild(copyRowItem);
				var editTooltip = document.createElement('span');
                editTooltip.className = 'tooltiptext';
                editTooltip.textContent = edit.tooltip.text;
                editContainer.appendChild(editTooltip);
	            contextMenu.appendChild(editContainer);
			}catch(error){
               console.warn(error +'tooltip is not initlize');
			}
		}else{
			copyRowItem=document.createElement('li');
			copyRowItem.id='cropRow_';
			copyRowItem.textContent=_cpR.text +'✂️';
			contextMenu.appendChild(copyRowItem);
		}
    }catch(error){
      console.warn(error + "not Create copy button")
    }
  }
  if(_cpWh.on && _cpWh.text!=''){
    try{
      copyRowItemWithHeader=document.createElement('li');
      copyRowItemWithHeader.id='cropRow_Header';
      copyRowItemWithHeader.textContent=_cpWh.text +'✂️';
      contextMenu.appendChild(copyRowItemWithHeader);
    }catch(error){
      console.warn(error + "not Create copy with header")
    }
  }
  if(Pn_row.on && Pn_row.text!=''){
    try{
      Print_rowItem=document.createElement('li');
      Print_rowItem.id='Print_row';
      Print_rowItem.textContent=Pn_row.text +'🖨️';
      contextMenu.appendChild(Print_rowItem);
    }catch(error){
      console.warn(error + "not print! work fine")
    }
  }
  if(exportJson.on && exportJson.text!=''){
    try{
      var exportJsonBtn = document.createElement('button');
      exportJsonBtn.textContent =translate(selectedLanguage, "exportJson")
      exportJsonBtn.setAttribute('id','exportJsonBtn_e');
      contextMenu.appendChild(exportJsonBtn);
    }catch(error){
      console.warn(error + "not print! work fine")
    }
  }
  closeButton.addEventListener('click', function () {
    contextMenu.style.display = 'none';
  });
  document.body.appendChild(contextMenu);
  updateAfterLocalization(selectedLanguage);
}
// in upper function funtionality is pending
function copyToClipboard(text) {
  var dummy = document.createElement('textarea');
  dummy.style.position = 'fixed';
  dummy.style.top = '0';
  dummy.style.left = '0';
  dummy.style.opacity = '0';
  dummy.value = text;
  document.body.appendChild(dummy);
  dummy.focus();
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
}
function findRows_addClass(dragAnd_DropRow,tableSelector){
  var rows = document.querySelectorAll('tbody tr');
 rows.forEach(function(row) {
  row.addEventListener('mouseover', function() {
    addRowHighlight(row);
  });
  row.addEventListener('mouseout', function() {
    removeRowHighlight(row);
  });
  row.addEventListener('click', function() {
    toggleRowHighlight(row);
  });
  
 });
 if(dragAnd_DropRow && dragAnd_DropRow!=undefined){
	enableDragAndDrop(tableSelector)
 }
}
function enableDragAndDrop(tableSelector) {
	var table = document.getElementById(tableSelector.substring(1)); // Remove '#' from the selector
	if (!table) {
		console.error('Table element not found.');
		return;
	}
	table.addEventListener('dragstart', function(e) {
	  if (e.target.tagName === 'TR') {
		e.dataTransfer.setData('text/plain', ''); // Required for Firefox
		e.target.classList.add('dragged-row');
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text', e.target.rowIndex);
	  }
	});
	table.addEventListener('dragend', function(e) {
	  if (e.target.tagName === 'TR') {
		e.target.classList.remove('dragged-row');
	  }
	});
	table.addEventListener('dragover', function(e) {
	  e.preventDefault();
	  if (e.target.tagName === 'TR') {
		e.target.classList.add('drop-target-row');
	  }
	});
  	table.addEventListener('dragleave', function(e) {
	  if (e.target.tagName === 'TR') {
		e.target.classList.remove('drop-target-row');
	  }
	});
  
	table.addEventListener('drop', function(e) {
	  e.preventDefault();
	  var sourceIndex = parseInt(e.dataTransfer.getData('text'), 10);
	  var targetIndex = e.target.rowIndex;
  
	  if (isNaN(sourceIndex) || isNaN(targetIndex) || sourceIndex === targetIndex) {
		return;
	  }
	  var tbody = table.querySelector('tbody');
	  var rows = Array.from(tbody.querySelectorAll('tr'));
	  var sourceRow = rows[sourceIndex];
	  var targetRow = rows[targetIndex];
  
	  if (sourceIndex < targetIndex) {
		tbody.insertBefore(sourceRow, targetRow.nextSibling);
	  } else {
		tbody.insertBefore(sourceRow, targetRow);
	  }
  
	  e.target.classList.remove('drop-target-row');
	});
  }
function addRowHighlight(row) {
  row.classList.add('highlighted-row');
  row.style.color='Black'
}
function removeRowHighlight(row) {
  row.classList.remove('highlighted-row');
  row.style.removeProperty('color')
}
function toggleRowHighlight(row) {
  row.classList.toggle('highlighted-row');
}
function EnableLocalisation(container_id,text_style,tableSelector,columns,lang_code){
      var selectLang = document.createElement("select");
			selectLang.setAttribute("id", "languageSelector");
			selectLang.setAttribute("onchange", "changeLanguage(this.value)")
			languages.forEach(function(language) {
				var option = document.createElement("option");
				option.value = language.code;
				option.text = language.name;
				selectLang.appendChild(option);
			});
			var languageSelectorContainer = document.getElementById(container_id);
			if (languageSelectorContainer != null) {
				languageSelectorContainer.appendChild(selectLang);
				selectLang.setAttribute('style', 'display:none;');
				try {
					languages.forEach(function(lng_code) {
						if (lng_code.code == lang_code) {
							changeLanguage(lng_code.code);
							updateLocalization(lang_code);
							showEmptyTableMessage(tableSelector,translate(lng_code.code, "noDataAvailable"), columns, text_style);
						}
					});
				} catch (error) {
					console.warn("Languages not attached. Please use the language selector. and it will working fine");
				}
			} else {
				selectLang.setAttribute('style', 'display:none;');
				console.warn("language selector is not defined!")
	}
}
function showEmptyTableMessage(tableSelector, message, columns, textStyle) {
	var table = document.querySelector(tableSelector);
	var tbody = table.querySelector('tbody');
	if (!tbody) {
		tbody = document.createElement('tbody');
		table.appendChild(tbody);
	}
	var emptyRow = document.createElement('tr');
	var emptyCell = document.createElement('td');
	emptyCell.colSpan = columns.length;
	emptyCell.textContent = message;
	Object.assign(emptyCell.style, textStyle);
	emptyRow.appendChild(emptyCell);
	tbody.innerHTML = '';
	tbody.appendChild(emptyRow);
	console.warn("no data available in table please add data")
}
function addDataColumnToTableHeading(tableSelector, table, columnValues) {
	try {
		var thead = table.querySelector('thead');
		if (thead) {
			let thl = thead.querySelectorAll('th');
			if (columnValues && columnValues.length > 0) { // Check if columnValues is an array and not empty
				columnValues.forEach(function(column, index) {
					if (column) {
						if (thl[index]) { // Make sure there is a corresponding th element
							thl[index].setAttribute('data-column', column.field);
						} else {
							console.error('Column value provided without corresponding th element');
						}
					} else {
						console.error('Please provide valid column values');
					}
				});
			} else {
				console.error('Please add column values to proceed');
			}
		}
	} catch (error) {
		throw new Error(error + ' Please add this element!');
	}
}
function applyColumnFilter(columnField, filterValue, tableSelector) {
	var table = document.querySelector(tableSelector);
	var tbody = table.querySelector('tbody');
	var rows = tbody.querySelectorAll('tr');
	rows.forEach(function(row) {
		var cell = row.querySelector('td[data-column="' + columnField + '"]');
		if (cell) {
			var cellData = cell.textContent.toLowerCase();
			var showRow = cellData.includes(filterValue.toLowerCase());
			row.style.display = showRow ? 'table-row' : 'none';
		}
	});
}
function showFilterModal(columnField, columns, tableSelector) {
	var column = columns.find(function(col) {
		return col.field === columnField;
	});
	var filterModal = document.createElement('div');
	filterModal.className = 'filter-modal';
	var filterInput;
	if (column.dataType === 'number') {
		filterInput = document.createElement('input');
		filterInput.type = 'number';
	} else if (column.dataType === 'date') {
		filterInput = document.createElement('input');
		filterInput.type = 'date';
	} else {
		filterInput = document.createElement('input');
		filterInput.type = 'text';
	}
	var applyButton = document.createElement('button');
	applyButton.textContent = 'Apply';
	applyButton.addEventListener('click', function() {
		applyColumnFilter(columnField, filterInput.value, tableSelector); // Apply the filter
		filterModal.parentNode.removeChild(filterModal);
	});

	filterModal.appendChild(filterInput);
	filterModal.appendChild(applyButton);

	var filterContainer = document.getElementById('filterContainer');
	filterContainer.appendChild(filterModal);
}
function addFilterIcons(table, columns, tableSelector) {
	var thead = table.querySelector('thead');
	if (thead) {
		var thList = thead.querySelectorAll('th');
		thList.forEach(function(th) {
			var columnField = th.getAttribute('data-column');
			if (columnField == null) {
				th.addEventListener('click', function(event) {
					var target = event.target;
					if (target.classList.contains('filter-icon')) {
						var columnField = target.parentNode.getAttribute('data-column');
						showFilterModal(columnField, columns, tableSelector);
					}
				});
			} else {
				var column = columns.find(function(col) {
					return col.field === columnField;
				});
				if (column.filterable !== false) {
					var filterIcon = document.createElement('span');
					filterIcon.className = 'filter-icon';
					filterIcon.innerHTML = '⚟';
					th.appendChild(filterIcon);
				}
				th.addEventListener('click', function(event) {
					var target = event.target;

					if (target.classList.contains('filter-icon')) {
						var columnField = target.parentNode.getAttribute('data-column');
						showFilterModal(columnField, columns, tableSelector);
					}
				});
			}
		});
	}
}
function addGlobalSearch(tableSelector, columns, _data, defaultPageSize, showingentry, 
	currentPage, pageSize, totalRecordsCountDiv,groupByColumn,selectedLanguage,showingEnteriesTextEnable) {
	try {
		var table = document.querySelector(tableSelector);
		var searchInput = document.createElement('input');
		searchInput.setAttribute("id", "globalSearch");
		searchInput.setAttribute("placeholder", "Search...");
		searchInput.style.float = 'right';
		var paginationOptionsContainer = document.createElement('div');
		paginationOptionsContainer.classList.add('pagination-options');
		paginationOptionsContainer.setAttribute('style', 'display:none;')
		var pageSizeLabel = document.createElement('label');
		pageSizeLabel.textContent = 'Page Size: ';
		var pageSizeSelect = document.createElement('select');
		pageSizeSelect.setAttribute("id", "p-select");
		var pageSizeOptions = [10, 25, 50, 100];
		pageSizeOptions.forEach(function(size) {
			var option = document.createElement('option');
			option.value = size;
			option.textContent = size;
			if (size === defaultPageSize) {
				option.selected = true;
			}
			pageSizeSelect.appendChild(option);
		});
		pageSizeSelect.addEventListener('change', function() {
			var newPageSize = parseInt(pageSizeSelect.value, 10);
			if (!isNaN(newPageSize)) {
				pageSize = newPageSize;
				currentPage = 1;
				var totalPages = Math.ceil(_data.length / pageSize);
				updateTable(tableSelector, _data, columns, currentPage, pageSize,groupByColumn);
				updatePaginationControls(tableSelector, currentPage, totalPages, _data, pageSize, columns, showingentry,'',selectedLanguage);
			}
		});
		searchInput.addEventListener('input', function() {
			applyGlobalSearch(tableSelector, columns, _data)
		});

		if (showingentry) {
			try {
				var showingEntryText = document.querySelector('.showing-entry-text');
				var startEntry = (currentPage - 1) * pageSize + 1;
				var endEntry = Math.min(currentPage * pageSize, _data.length);
				if(showingEnteriesTextEnable){
					var getShowingEnteryTextFromAnotherPlaceWhenLanguageChange='';
					if(selectedLanguage==='hi' || selectedLanguage==='bn' || selectedLanguage=='ja' || selectedLanguage==='ko'){
						getShowingEnteryTextFromAnotherPlaceWhenLanguageChange=translate(selectedLanguage,'translationShowEntries');
						showingEntryText.textContent=getShowingEnteryTextFromAnotherPlaceWhenLanguageChange.replace('{}',_data.length)
						.replace('{}',startEntry)
						.replace('{}',endEntry)
					}else{
						getShowingEnteryTextFromAnotherPlaceWhenLanguageChange=translate(selectedLanguage,'translationShowEntries');
						showingEntryText.textContent=getShowingEnteryTextFromAnotherPlaceWhenLanguageChange.replace('{}',startEntry)
						.replace('{}',endEntry).replace('{}',_data.length);
					}
				}else{
					var getShowingEnteryTextFromAnotherPlace=translate('en','translationShowEntries')
					showingEntryText.textContent = getShowingEnteryTextFromAnotherPlace
					.replace('{}',startEntry)
					.replace('{}',endEntry)
					.replace('{}',_data.length)
				}
			} catch (error) {
				console.log(error)
			}

		}
		var pageSizeContainer = document.createElement('div');
		pageSizeContainer.appendChild(pageSizeLabel);
		pageSizeContainer.appendChild(pageSizeSelect);
		paginationOptionsContainer.appendChild(pageSizeContainer);
		var pSelectElement = document.getElementById('pselect');
		if (pSelectElement) {
			var pagingOptions = document.getElementById("pagingOptions");
			// pagingOptions.classList.add("hide");
			pSelectElement.parentNode.insertBefore(searchInput, pSelectElement.nextSibling);
		} else {
			console.warn("paging not found add paging")
		}
		table.parentNode.insertBefore(paginationOptionsContainer, table);
		updateTotalRecordsCount(totalRecordsCountDiv, _data.length,selectedLanguage);
	} catch (error) {
		throw new error(error + "Occuned")
	}
}
function enableKeyboardShortcuts(tableSelector,_ColumnIndex,target_,enter_pressOn) {
    var table = document.querySelector(tableSelector);

    if (!table) {
        console.error('Table element not found.');
        return;
    }

    document.addEventListener('keydown', function(e) {
        // Check if the event target is an input element to avoid conflicts with typing in inputs
        if (e.target.tagName === 'INPUT') {
            return;
        }
        var activeRow = table.querySelector('.active-row');
        var rows = table.querySelectorAll('tbody tr');
        switch (e.key) {
            case 'ArrowUp':
                if (activeRow) {
                    var rowIndex = Array.from(rows).indexOf(activeRow);
					var prevRow = rows[rowIndex - 1];
                    if (prevRow) {
                        activeRow.classList.remove('active-row');
                        prevRow.classList.add('active-row');
                    }
                } else {
                    rows[0].classList.add('active-row');
                }
                break;
            case 'ArrowDown':
                if (activeRow) {
                    var rowIndex = Array.from(rows).indexOf(activeRow);
                    var nextRow = rows[rowIndex + 1];
                    if (nextRow) {
                        activeRow.classList.remove('active-row');
                        nextRow.classList.add('active-row');
                    }
                } else {
                    rows[0].classList.add('active-row');
                }
                break;
            case 'Enter':
				if(enter_pressOn){
					var activeRowTr = document.querySelector('tr.active-row');
					if (activeRowTr) {
						e.preventDefault();
						var columnIndex =_ColumnIndex?_ColumnIndex:0;
						var columnIndices = columnIndex.split(',').map(index => parseInt(index.trim()));
					if (columnIndices.length === 1) {
						var anchorTag = activeRow.querySelectorAll('td')[columnIndices[0]].querySelector('a');
						if (anchorTag) {
							if(target_ !=""){
								anchorTag.target=target_;
								anchorTag.click();
							}else{
								anchorTag.click(); // Trigger click on the anchor tag
							}
					    }
				    } else if (columnIndices.length > 1) {
						columnIndices.forEach(columnIndex => {
						var anchorTag = activeRow.querySelectorAll('td')[columnIndex].querySelector('a');
						if (anchorTag) {
							anchorTag.target=target_?target_:'';
							anchorTag.click();
						}
					  });
					}
					}else{
						rows[0].classList.add('active-row');
					}
					break;
				}else{
                   console.warn('for Enter click please on properties of enter button press')
				}
            case 'Delete':
                if (activeRow) {
                    // Implement your action for deleting the active row
                    // For example: deleteRow(activeRow.dataset.id);
                }
                break;

            // Add more cases for other keyboard shortcuts here
        }

        // Prevent default behavior for arrow keys to avoid scrolling
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
        }
    });
    // Add focus event listeners to the rows for better keyboard navigation
    rows.forEach(function(row) {
        row.addEventListener('focus', function() {
            if (activeRow) {
                activeRow.classList.remove('active-row');
            }
            row.classList.add('active-row');
        });
        row.addEventListener('blur', function() {
            row.classList.remove('active-row');
        });
    });
}
function applyGlobalSearch(tableSelector, columns, _data) {
    var table = document.querySelector(tableSelector);
    var searchInput = document.getElementById('globalSearch');
    var searchTerm = searchInput.value.toLowerCase().trim().replace(/\s+/g, '');
    var tbody = table.querySelector('tbody');
    var rows = tbody.querySelectorAll('tr');

    var matchingRows = 0; // Initialize a counter for matching rows

    if (rows.length > 1 && _data != '') {
        rows.forEach(function (row) {
            var rowData = Array.from(row.querySelectorAll('td')).map(function (cell, index) {
                var column = columns[index];
                var cellData = cell.textContent.toLowerCase().trim().replace(/\s+/g, '');
                return {
                    cellData,
                    column
                };
            });
            var showRow = rowData.some(function ({
                cellData,
                column
            }) {
                if (column.filterable !== false) {
                    return cellData.includes(searchTerm);
                }
                return false;
            });
            row.style.display = showRow ? 'table-row' : 'none';

            if (showRow) {
                matchingRows++; // Increment the counter for each matching row
            }
        });
        if (matchingRows === 0) {
            showEmptyTableMessage(tableSelector, translate(selectedLanguage,'noMatchingRecord'), columns);
        }
    } else if(rows.length===1 && _data!='') {
		updateTableChunk(tableSelector,_data,columns)
		// updateTable(tableSelector,_data,columns)
	}else{
        showEmptyTableMessage(tableSelector,translate(selectedLanguage,'noMatchingRecord'), columns);
    }
}
function addPaginationContainer(tableSelector) {
	var table = document.querySelector(tableSelector);
	var paginationContainer = document.createElement('div');
	paginationContainer.classList.add('pagination');
	table.insertAdjacentElement('afterend', paginationContainer);
}
function updateLocalization(selectedLanguage) {
	try{
		var tralslatedTextSearchPlaceHolder=translate(selectedLanguage,'searchPlaceholder');
		document.getElementById('globalSearch').setAttribute("placeholder",tralslatedTextSearchPlaceHolder)
	}catch(error){
       console.warn(error,'attribute is working fine if now available please contact us!')
	}
	
}
function updateAfterLocalization(selectedLanguage) {
  try {
    var editButton = document.getElementById('edit_bTableBtn');
    editButton.textContent = translate(selectedLanguage, "edit");
    var crpRowHead = document.getElementById('cropRow_Header');
    crpRowHead.textContent = translate(selectedLanguage,'copyCurrentRowWithHeaders') + '✂️';
    var printRow=document.getElementById('Print_row');
    printRow.textContent=translate(selectedLanguage,'printCurrentRow')+'🖨️';
    var cropRow_=document.getElementById('cropRow_');
    cropRow_.textContent=translate(selectedLanguage,'copyCurrentRow')+'✂️';
  } catch (error) {
    console.log(error);
    throw error(error);
  }
}
function exportTableDataToJson(tableSelector, columns) {
  var table = document.querySelector(tableSelector);
  var rows = Array.from(table.querySelectorAll('tbody tr'));
  var data = rows.map(function (row) {
    var rowData = {};
    row.querySelectorAll('td').forEach(function (cell, index) {
      rowData[columns[index].field] = cell.textContent;
    });
    return rowData;
  });
  var jsonData = JSON.stringify(data, null, 2);
  var blob = new Blob([jsonData], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'tableData.json';
  a.click();
  URL.revokeObjectURL(url);
}
function updateTotalRecordsCount(totalRecordsCountDiv, count,selectedLanguage) {
	updateLocalization(selectedLanguage);
	totalRecordsCountDiv.textContent = 'Total Records: ' + count;
}
function addSortableColumns(table, shortSpec, columns, sortDirection, currentPage, pageSize, _data, tableSelector, showingentry) {
	addAttributeDataShortable(table.querySelector("thead"), shortSpec);
	var thList = table.querySelectorAll('th[data-sortable="true"]');
	thList.forEach(function(th) {
		th.addEventListener('click', throttle(function() {
			thList.forEach(function(header) {
				header.innerHTML = header.innerHTML.replace(' ▼', '').replace(' ▲', '');
			});
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
			currentPage = 1;
			var columnIndex = Array.from(th.parentNode.children).indexOf(th);
			_data.sort(function(a, b) {
				var aValue = a[columns[columnIndex].field];
				var bValue = b[columns[columnIndex].field];
				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
				} else {
					return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
				}
			});
			updateTableChunk(tableSelector, _data, columns, currentPage, pageSize);
			var totalPages = Math.ceil(_data.length / pageSize);
			updatePaginationControls(tableSelector, currentPage, totalPages, _data, pageSize, columns, showingentry,'',selectedLanguage);
			if (sortDirection === 'asc') {
				th.innerHTML += '   ▲';
			} else {
				th.innerHTML += '   ▼';
			}
		}, 300));
	});
}
function updateTable(tableSelector, _data, _columns, currentPage, pageSize, groupByColumns) {
  var table = document.querySelector(tableSelector);
  var tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  var startIndex = (currentPage - 1) * pageSize;
  var endIndex = startIndex + pageSize;
  var dataToShow = _data.slice(startIndex, endIndex);

  function groupData(data, groupColumns) {
    if (groupColumns.length === 0) {
      return [{ key: [], values: data }];
    }
    var groupedData = [];
    var groupMap = new Map();
    data.forEach(function(item) {
      var groupKey = groupColumns.map(column => item[column]).join('|');
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey).push(item);
    });
    groupMap.forEach(function(groupItems, groupKey) {
      groupedData.push({ key: groupKey.split('|'), values: groupItems });
    });
    return groupedData;
  }
  var groupedData = groupData(dataToShow, groupByColumns || []);
function renderGroupRow(groupKeys) {
	if(groupKeys.length>0){
		var groupRow = document.createElement('tr');
		var groupCell = document.createElement('td');
		groupCell.setAttribute('colspan', _columns.length);
		groupCell.textContent = groupKeys.join(' - '); // Display group keys
		groupRow.appendChild(groupCell);
		tbody.appendChild(groupRow);
	} 
}
  groupedData.forEach(function(group) {
    renderGroupRow(group.key);
    group.values.forEach(function(item, rowIndex) {
      var newRow = document.createElement('tr');
      _columns.forEach(function(column) {
        var newCell = document.createElement('td');
        if (column.field === 'delete') {
          newCell.innerHTML = column.render(rowIndex);
        } else if (typeof column.render === 'function') {
          newCell.innerHTML = column.render(item[column.field]);
        } else {
          newCell.textContent = item[column.field];
        }
        newRow.appendChild(newCell);
      });
      tbody.appendChild(newRow);
    });
  });
}
function updatePaginationControls(tableSelector, currentPage, totalPages, _data, pageSize, columns, showingentry,groupByColumn,selectedLanguage) {
	try {
		var paginationContainer = document.querySelector(tableSelector + ' + .pagination');
		if (paginationContainer) {
			paginationContainer.innerHTML = '';

			function createPaginationButton(label, page, disabled) {
				var button = document.createElement('button');
				button.textContent = label;
				button.disabled = disabled;
				button.addEventListener('click', function() {
					if (!disabled) {
						currentPage = page;
						updateTable(tableSelector, _data, columns, currentPage, pageSize,groupByColumn);
						updatePaginationControls(tableSelector, currentPage, totalPages, _data, pageSize, columns, showingentry,groupByColumn,selectedLanguage);
					}
				});
				return button;
			}
			var backButton = createPaginationButton('<', currentPage - 1, currentPage === 1);
			var forwardButton = createPaginationButton('>', currentPage + 1, currentPage === totalPages);
			var prev2Button = createPaginationButton('<<', currentPage - 2, currentPage <= 2);
			var next2Button = createPaginationButton('>>', currentPage + 2, currentPage >= totalPages - 1);
			var currentPageIndicator = document.createElement('span');
			currentPageIndicator.textContent = currentPage;
			paginationContainer.appendChild(backButton);
			paginationContainer.appendChild(prev2Button);
			paginationContainer.appendChild(currentPageIndicator);
			paginationContainer.appendChild(next2Button);
			paginationContainer.appendChild(forwardButton);
			if (showingentry) {
				try {
					var showingEntryText = document.querySelector('.showing-entry-text');
					if (showingEntryText == null) {
						createShowingEntryAgain()
						try {
							let showingEntryText = document.querySelector('.showing-entry-text');
							var startEntry = (currentPage - 1) * pageSize + 1;
							var endEntry = Math.min(currentPage * pageSize, _data.length);
							var getShowingEnteryTextFromAnotherPlaceWhenLanguageChange = '';
                        if (selectedLanguage === 'hi' || selectedLanguage === 'bn' || selectedLanguage == 'ja' || selectedLanguage === 'ko') {
                              getShowingEnteryTextFromAnotherPlaceWhenLanguageChange = translate(selectedLanguage, 'translationShowEntries');
                              showingEntryText.textContent = getShowingEnteryTextFromAnotherPlaceWhenLanguageChange.replace('{}', _data.length)
                              .replace('{}', startEntry)
                              .replace('{}', endEntry)
                        }else {
                              getShowingEnteryTextFromAnotherPlaceWhenLanguageChange = translate(selectedLanguage, 'translationShowEntries');
                              showingEntryText.textContent = getShowingEnteryTextFromAnotherPlaceWhenLanguageChange.replace('{}', startEntry)
                              .replace('{}', endEntry)
                              .replace('{}', _data.length);
                        }
						} catch (error) {
							console.warn(error + "but it will work fine!")
						}
					} else {
						var startEntry = (currentPage - 1) * pageSize + 1;
						var endEntry = Math.min(currentPage * pageSize, _data.length);
						showingEntryText.textContent = `Showing ${startEntry}-${endEntry} of ${_data.length} entries`;
					}
				} catch (error) {
					console.log(error)
				}

			}
		}
	} catch (error) {
		console.warn(error);
	}

}
function addAttributeDataShortable(table, shortingValues) {
	var thList = table.querySelectorAll("th");
	if (thList.length > 0 && shortingValues.length > 0) {
		thList.forEach(function(th, index) {
			if (index < shortingValues.length) {
				th.setAttribute("data-sortable", true);
			}
		});
	} else if (thList.length > 0 && shortingValues.length == 0) {
		thList.forEach(function(th, index) {
			th.setAttribute("data-sortable", true);
		});
	}
}
function addColumnFiltering(tableSelector, columns, _data, currentPage, pageSize) {
	var table = document.querySelector(tableSelector);
	var thead = table.querySelector('thead');
	if (thead) {
		var tr = document.createElement('tr');
		var filterInputs = []; // Array to store filter input elements
		columns.forEach(function(column) {
			var th = document.createElement('th');
			if (column.filterable !== false) {
				var input = document.createElement('input');
				input.setAttribute('type', 'text');
				input.setAttribute('placeholder', 'Filter');
				input.addEventListener('input', function() {
					applyFilters(tableSelector, columns); // Call applyFilters with _data argument
				});
				th.appendChild(input);
				filterInputs.push(input); // Store the input element
			} else {
				th.textContent = column.header || '';
			}
			tr.appendChild(th);
		});
		thead.appendChild(tr);
		applyFilters(tableSelector, columns);
	}
}
function applyFilters(tableSelector, columns) {
	var table = document.querySelector(tableSelector);
	var filters = table.querySelectorAll('thead input[type="text"]');
	var filterValues = Array.from(filters).map(function(input) {
		return input.value.toLowerCase();
	});
	var tbody = table.querySelector('tbody');
	var rows = tbody.querySelectorAll('tr');
	rows.forEach(function(row) {
		var rowData = Array.from(row.querySelectorAll('td')).map(function(cell, index) {
			var column = columns[index];
			var cellData = cell.textContent.toLowerCase();
			var filterValue = filterValues[index];
			return {
				cellData,
				filterValue,
				column
			};
		});
		var showRow = rowData.every(function({
			cellData,
			filterValue,
			column
		}) {
			if (column.filterable !== false) {
				return filterValue === '' || cellData.includes(filterValue);
			}
			return true;
		});
		row.style.display = showRow ? 'table-row' : 'none';
	});
}
function addRowSelection(table) {
	var tbody = table.querySelector('tbody');
	tbody.addEventListener('click', function(event) {
		var target = event.target;
		if (target.tagName === 'TD' && !target.classList.contains('select-cell')) {
			var row = target.parentNode;
			toggleRowSelection(row);
		}
	});
}
function toggleRowSelection(row) {
	row.classList.toggle('selected-row');
	var checkbox = row.querySelector('.select-row-checkbox');
	if (checkbox) {
		checkbox.checked = !checkbox.checked;
	}
}
function addPaginationOptions(table, defaultPageSize, tableSelector, _data, columns, totalRecordsCountDiv, cPZise, showingentry,goto_page,groupByColumn,selectedLanguage) {
	try {
		var paginationOptionsContainer = document.createElement('div');
		paginationOptionsContainer.classList.add('pagination-options');
		paginationOptionsContainer.setAttribute("id", 'pagingOptions');
		if (cPZise == false) {
			var pageSizeLabel = document.createElement('label');
			pageSizeLabel.textContent = 'Page Size: ';
			var pageSizeSelect = document.createElement('select');
			pageSizeSelect.setAttribute("id", "pselect");
			var pageSizeOptions = [10, 25, 50, 100];
			pageSizeOptions.forEach(function(size) {
				var option = document.createElement('option');
				option.value = size;
				option.textContent = size;
				if (size === defaultPageSize) {
					option.selected = true;
				}
				pageSizeSelect.appendChild(option);
			});
			pageSizeSelect.addEventListener('change', function() {
				var newPageSize = parseInt(pageSizeSelect.value, 10);
				if (!isNaN(newPageSize)) {
					pageSize = newPageSize;
					if(goto_page.value!="" && goto_page.value!=0 && goto_page.on==true){
                          currentPage=goto_page.value;
					}else{
						currentPage = 1;
					}
					var totalPages = Math.ceil(_data.length / pageSize);
					updateTable(tableSelector, _data, columns, currentPage, pageSize,groupByColumn);
					updatePaginationControls(tableSelector, currentPage, totalPages, _data, pageSize, columns, showingentry);
				}
			});

			var pageSizeContainer = document.createElement('div');
			pageSizeContainer.appendChild(pageSizeLabel);
			pageSizeContainer.appendChild(pageSizeSelect);
			paginationOptionsContainer.appendChild(pageSizeContainer);
		} else {
			var customPageSizeInput = document.createElement('input');
			customPageSizeInput.setAttribute('type', 'number');
			customPageSizeInput.setAttribute('min', '1');
			customPageSizeInput.setAttribute('placeholder', 'Custom');

			var applyPageSizeButton = document.createElement('button');
			applyPageSizeButton.textContent = 'Apply';

			applyPageSizeButton.addEventListener('click', function() {
				var newPageSize = parseInt(customPageSizeInput.value, 10);
				if (!isNaN(newPageSize)) {
					pageSize = newPageSize;
					currentPage = 1;
					var totalPages = Math.ceil(_data.length / pageSize);
					updateTable(tableSelector, _data, columns, currentPage, pageSize,groupByColumn);
					updatePaginationControls(tableSelector, currentPage, totalPages, _data, pageSize, columns, showingentry);
				}
			});

			var customPageSizeContainer = document.createElement('div');
			customPageSizeContainer.appendChild(customPageSizeInput);
			customPageSizeContainer.appendChild(applyPageSizeButton);
			paginationOptionsContainer.appendChild(customPageSizeContainer);
		}
		if (showingentry) {
			var showingEntryText = document.createElement('div');
			showingEntryText.classList.add('showing-entry-text');
			paginationOptionsContainer.appendChild(showingEntryText);
			var paginationcontrols = document.querySelector('.pagination');
			paginationcontrols.appendChild(showingEntryText)
		}
		table.parentNode.insertBefore(paginationOptionsContainer, table);
		updateTotalRecordsCount(totalRecordsCountDiv, _data.length,selectedLanguage);
	} catch (error) {
		console.warn(error);
	}

}
function createShowingEntryAgain() {
	var paginationOptionsContainer = document.getElementById("pagingOptions");
	if (paginationOptionsContainer != null) {
		try {
			var showingEntryText = document.createElement('div');
			showingEntryText.classList.add('showing-entry-text');
			paginationOptionsContainer.appendChild(showingEntryText);
			var paginationcontrols = document.querySelector('.pagination');
			paginationcontrols.appendChild(showingEntryText)
		} catch (error) {
			console.warn("pagination container is missing please enable pagination")
		}
	} else {
		console.warn("if working than don't do anything this will work fine everytime!")
	}

}
function addColumnResizing(tableSelector, columns) {
	var table = document.querySelector(tableSelector);
	var resizeHandle = document.createElement('div');
	resizeHandle.classList.add('column-resize-handle');
	table.appendChild(resizeHandle);
	var resizingColumn = null;
	var startX = 0;
	var thList = table.querySelectorAll('th');
	thList.forEach(function(th, index) {
		if (columns[index].resizable !== false) {
			th.addEventListener('mousedown', function(e) {
				resizingColumn = th;
				startX = e.pageX;
			});
		}
	});
	document.addEventListener('mousemove', function(e) {
		if (resizingColumn) {
			var width = resizingColumn.offsetWidth + (e.pageX - startX);
			if (width > 50) {
				resizingColumn.style.width = width + 'px';
			}
			startX = e.pageX;
		}
	});
	document.addEventListener('mouseup', function() {
		resizingColumn = null;
	});
}
function renderDeleteButton(rowIndex) {
	return '<button class="delete-btn" data-row-index="' + rowIndex + '">Delete</button>';
}
function renderSelectCheckbox(data, row) {
	return '<input type="checkbox" class="select-row-checkbox" data-row-index="' + row.index + '">';
}
document.addEventListener('click', function(event) {
	var target = event.target;
	if (target.classList.contains('delete-btn')) {
		var rowIndex = parseInt(target.getAttribute('data-row-index'));
		if (!isNaN(rowIndex)) {
			deleteRow(rowIndex);
		}
	} else if (target.classList.contains('select-row-checkbox')) {
		var rowIndex = parseInt(target.getAttribute('data-row-index'));
		if (!isNaN(rowIndex)) {
			toggleRowSelection(rowIndex);
		}
	}
});
function deleteRow(rowIndex) {
	var table = document.querySelector('#myTable');
	var tbody = table.querySelector('tbody');
	var rows = tbody.querySelectorAll('tr');
	if (rowIndex >= 0 && rowIndex < rows.length) {
		rows[rowIndex].remove();
		updateRowIndexes();
	}
}
function updateRowIndexes() {
	var table = document.querySelector('#myTable');
	var tbody = table.querySelector('tbody');
	var rows = tbody.querySelectorAll('tr');
	rows.forEach(function(row, index) {
		var deleteBtn = row.querySelector('.delete-btn');
		if (deleteBtn) {
			deleteBtn.setAttribute('data-row-index', index);
		}
		var selectCheckbox = row.querySelector('.select-row-checkbox');
		if (selectCheckbox) {
			selectCheckbox.setAttribute('data-row-index', index);
		}
	});
}
function throttle(func, limit) {
	let lastFunc;
	let lastRan;
	return function() {
		const context = this;
		const args = arguments;
		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(function() {
				if (Date.now() - lastRan >= limit) {
					func.apply(context, args);
					lastRan = Date.now();
				}
			}, limit - (Date.now() - lastRan));
		}
	};
}
function updateTableWithData(data, tableSelector) {
	try {
		var table = document.querySelector(tableSelector);
		var tbody = table.querySelector('tbody');
		tbody.innerHTML = '';
		data.forEach(function(row) {
			var newRow = document.createElement('tr');
			row.forEach(function(cell) {
				var newCell = document.createElement('td');
				newCell.textContent = cell;
				newRow.appendChild(newCell);
			});
			tbody.appendChild(newRow);
		});
	} catch (error) {
		console.log(error)
	}

}
function parseCSV(csv) {
	var lines = csv.split('\n');
	var data = [];
	for (var i = 0; i < lines.length; i++) {
		var cells = lines[i].split(',');
		data.push(cells);
	}
	return data;
}
function updateTableChunk(tableSelector, _data, _columns, currentPage, pageSize) {
	var table = document.querySelector(tableSelector);
	var tbody = table.querySelector('tbody');
	tbody.innerHTML = ''; // Clear the current table body content
	if(currentPage===undefined && pageSize===undefined){
		currentPage=1; pageSize=10
	}
	var startIndex = (currentPage-1) * pageSize;
	var endIndex = startIndex + pageSize;
	for (var i = startIndex; i < endIndex && i < _data.length; i++) {
		var item = _data[i];
		var newRow = document.createElement('tr');
		_columns.forEach(function(column) {
			var newCell = document.createElement('td');
			newCell.innerHTML = column.render ? column.render(item[column.field]) : item[column.field];
			newRow.appendChild(newCell);
		});
		tbody.appendChild(newRow);
	}
}
