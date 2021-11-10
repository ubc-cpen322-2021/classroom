function watchTextChange(node, hasChanged){
	// if node is falsy, return 0
	if (!node) return 0;

	// if node has the CSS class "skip", return 0
	if (node.classList && node.classList.contains('skip')) return 0;

	// initialize a variable to count the number of nodes that changed
	let count = 0;
	if (hasChanged(node)){
		// if the given node has changed, increment the count
		count ++;
		// add the CSS class "changed" to its parent
		node.parentNode.classList.add('changed');
	}

	// if node has child nodes, iterate through its children
	for (let i = 0; i < node.childNodes.length; i ++){
		let child = node.childNodes[i];
		// recursively call watchTextChange to retrieve the count from the child node
		count += watchTextChange(child, hasChanged);
	}

	return count;
}

// function watchTextChange(node, hasChanged){
// 	return (!node || (node.classList && node.classList.contains('skip'))) ? 0 : Array.from(node.childNodes).reduce((acc, child) => acc + watchTextChange(child, hasChanged), (hasChanged(node) ? (node.parentNode.classList.add('changed'), 1) : 0));
// }