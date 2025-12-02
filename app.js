const canvas = document.getElementById('treeCanvas');
const visualizer = new TreeVisualizer(canvas);
let currentTree = new BinaryTree();
let currentMode = 'traversal';

let traversalState = {
    active: false,
    type: null,
    order: [],
    currentIndex: 0,
    output: []
};

let tebakState = {
    tree: null,
    revealed: false
};

// Mode switching
document.getElementById('modeTraversal').addEventListener('click', () => switchMode('traversal'));
document.getElementById('modeBST').addEventListener('click', () => switchMode('bst'));
document.getElementById('modeTebak').addEventListener('click', () => switchMode('tebak'));
document.getElementById('modeBuatTree').addEventListener('click', () => switchMode('buatTree'));

function switchMode(mode) {
    currentMode = mode;
    
    // Update buttons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mode-content').forEach(content => content.classList.remove('active'));
    
    if (mode === 'traversal') {
        document.getElementById('modeTraversal').classList.add('active');
        document.getElementById('traversalMode').classList.add('active');
        visualizer.simplifyOnlyChild = false;
    } else if (mode === 'bst') {
        document.getElementById('modeBST').classList.add('active');
        document.getElementById('bstMode').classList.add('active');
        visualizer.simplifyOnlyChild = false;
    } else if (mode === 'tebak') {
        document.getElementById('modeTebak').classList.add('active');
        document.getElementById('tebakMode').classList.add('active');
        visualizer.simplifyOnlyChild = false;
    } else if (mode === 'buatTree') {
        document.getElementById('modeBuatTree').classList.add('active');
        document.getElementById('buatTreeMode').classList.add('active');
        initBuatTreeMode();
        return; 
    }
    
    visualizer.showPlaceholders = false;
    resetAll();
}

function resetAll() {
    currentTree = new BinaryTree();
    visualizer.setTree(null);
    visualizer.draw();
    
    traversalState = {
        active: false,
        type: null,
        order: [],
        currentIndex: 0,
        output: []
    };
    
    tebakState = {
        tree: null,
        revealed: false
    };
    
    document.getElementById('traversalOutput').textContent = '';
    document.getElementById('traversalControls').style.display = 'none';
    document.getElementById('nextStep').disabled = true;
    document.getElementById('tebakOutputs').innerHTML = '';
    document.getElementById('tebakReveal').style.display = 'none';
    document.getElementById('bstOperations').style.display = 'none';
    document.getElementById('bstInfo').innerHTML = '';
    document.getElementById('customNumbers').value = '';
    document.getElementById('newNumber').value = '';
    document.getElementById('deleteNumberInput').value = '';
    document.getElementById('bstCodeViz').style.display = 'none';
}

function updateMaxNodesHint(depthInput, hintElement, nodeCountInput) {
    const depth = parseInt(depthInput.value);
    const maxNodes = BinaryTree.getMaxNodes(depth);
    hintElement.textContent = `Max nodes: ${maxNodes}`;
    nodeCountInput.max = maxNodes;
    if (parseInt(nodeCountInput.value) > maxNodes) {
        nodeCountInput.value = maxNodes;
    }
}

document.getElementById('depth2').addEventListener('input', (e) => {
    updateMaxNodesHint(e.target, document.getElementById('depthHint2'), document.getElementById('nodeCount2'));
});

// Random Seed Tree 
document.getElementById('generateTree2').addEventListener('click', () => {
    const depth = parseInt(document.getElementById('depth2').value);
    const nodeCount = parseInt(document.getElementById('nodeCount2').value);
    
    currentTree.generateRandomTree(depth, nodeCount);
    visualizer.setTree(currentTree);
    visualizer.draw();
    
    document.getElementById('traversalControls').style.display = 'block';
    document.getElementById('nextStep').disabled = true;
    document.getElementById('traversalOutput').textContent = '';
    
    traversalState.active = false;
});

document.getElementById('startTraversal').addEventListener('click', () => {
    if (!currentTree.root) {
        showAlertModal('Please generate a tree first!');
        return;
    }
    
    const type = document.getElementById('traversalType').value;
    
    visualizer.reset();
    visualizer.draw();
    
    // Get traversal order
    traversalState = {
        active: true,
        type: type,
        order: currentTree.getTraversalOrder(type),
        currentIndex: 0,
        output: []
    };
    
    updateAlgorithmCode(type);
    
    document.getElementById('nextStep').disabled = false;
});

document.getElementById('nextStep').addEventListener('click', () => {
    if (!traversalState.active || traversalState.currentIndex >= traversalState.order.length) {
        return;
    }
    
    // Mark previous node (if exists)
    if (traversalState.currentIndex > 0) {
        const previousNode = traversalState.order[traversalState.currentIndex - 1];
        visualizer.markVisited(previousNode);
    }
    
    const currentNode = traversalState.order[traversalState.currentIndex];
    
    // Highlight current node
    visualizer.highlightNode(currentNode);
    visualizer.draw();
    
    // Add to output list
    traversalState.output.push(currentNode.value);
    document.getElementById('traversalOutput').textContent = traversalState.output.join(', ');
    
    traversalState.currentIndex++;
    
    if (traversalState.currentIndex >= traversalState.order.length) {
        visualizer.markVisited(currentNode);
        visualizer.highlightNode(null);
        visualizer.draw();
        document.getElementById('nextStep').disabled = true;
    }
});

document.getElementById('resetTraversal').addEventListener('click', () => {
    visualizer.reset();
    visualizer.draw();
    
    traversalState = {
        active: false,
        type: null,
        order: [],
        currentIndex: 0,
        output: []
    };
    
    document.getElementById('traversalOutput').textContent = '';
    document.getElementById('nextStep').disabled = true;
});

document.getElementById('generateTebak').addEventListener('click', () => {
    const depth = Math.floor(Math.random() * 3) + 3; 
    const maxNodes = BinaryTree.getMaxNodes(depth);
    const nodeCount = Math.floor(Math.random() * (maxNodes - 4)) + 5; 
    
    const tree = new BinaryTree();
    tree.generateRandomTree(depth, nodeCount);
    
    tebakState.tree = tree;
    tebakState.revealed = false;
    
    // Get all traversals
    const traversals = {
        'Preorder': tree.preorder().join(''),
        'Inorder': tree.inorder().join(''),
        'Postorder': tree.postorder().join(''),
        'Level Order': tree.levelorder().join('')
    };
    
    // Randomly select 2-4 traversals
    const numToShow = Math.floor(Math.random() * 3) + 2;
    const traversalKeys = Object.keys(traversals);
    const shuffled = traversalKeys.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, numToShow);
    
    const outputsDiv = document.getElementById('tebakOutputs');
    outputsDiv.innerHTML = '<h3>Traversal Outputs:</h3>';
    
    selected.forEach(key => {
        const div = document.createElement('div');
        div.className = 'tebak-output';
        div.innerHTML = `<strong>${key}:</strong> ${traversals[key]}`;
        outputsDiv.appendChild(div);
    });
    
    document.getElementById('tebakReveal').style.display = 'block';
    
    visualizer.setTree(null);
    visualizer.draw();
});

document.getElementById('revealTree').addEventListener('click', () => {
    if (!tebakState.tree) return;
    
    visualizer.setTree(tebakState.tree);
    visualizer.draw();
    tebakState.revealed = true;
    
    document.getElementById('tebakReveal').style.display = 'none';
});

updateMaxNodesHint(document.getElementById('depth2'), document.getElementById('depthHint2'), document.getElementById('nodeCount2'));

// Algorithm code templates
function updateAlgorithmCode(type) {
    const algorithmCode = document.getElementById('algorithmCode');
    const codes = {
        preorder: `<span class="keyword">void</span> <span class="function">preOrder</span>(<span class="type">BinTree</span> root) {
    <span class="keyword">if</span> (root != <span class="keyword">NULL</span>) {
        cout << root->info;
        <span class="function">preOrder</span>(root->left);
        <span class="function">preOrder</span>(root->right);
    }
}`,
        inorder: `<span class="keyword">void</span> <span class="function">inOrder</span>(<span class="type">BinTree</span> root) {
    <span class="keyword">if</span> (root != <span class="keyword">NULL</span>) {
        <span class="function">inOrder</span>(root->left);
        cout << root->info;
        <span class="function">inOrder</span>(root->right);
    }
}`,
        postorder: `<span class="keyword">void</span> <span class="function">postOrder</span>(<span class="type">BinTree</span> root) {
    <span class="keyword">if</span> (root != <span class="keyword">NULL</span>) {
        <span class="function">postOrder</span>(root->left);
        <span class="function">postOrder</span>(root->right);
        cout << root->info;
    }
}`,
        levelorder: `<span class="keyword">void</span> <span class="function">levelOrder</span>(<span class="type">BinTree</span> root) {
    <span class="keyword">if</span> (root == <span class="keyword">NULL</span>) <span class="keyword">return</span>;
    
    <span class="type">queue</span><<span class="type">address</span>> Q;
    Q.push(root);
    
    <span class="keyword">while</span> (!Q.empty()) {
        <span class="type">address</span> n = Q.front();
        Q.pop();
        cout << n->info;
        
        <span class="keyword">if</span> (n->left != <span class="keyword">NULL</span>)
            Q.push(n->left);
        <span class="keyword">if</span> (n->right != <span class="keyword">NULL</span>)
            Q.push(n->right);
    }
}`
    };
    
    algorithmCode.innerHTML = codes[type] || '';
}

// BST Algorithm code templates
function updateBSTAlgorithmCode(algo) {
    const algorithmCode = document.getElementById('bstAlgorithmCode');
    const codes = {
        insert: `<span class="keyword">void</span> <span class="function">insert</span>(<span class="type">BinTree</span>& root, <span class="keyword">int</span> value) {
    <span class="keyword">if</span> (root == <span class="keyword">NULL</span>) {
        root = <span class="keyword">new</span> <span class="type">Node</span>;
        root->info = value;
        root->left = <span class="keyword">NULL</span>;
        root->right = <span class="keyword">NULL</span>;
    }
    <span class="keyword">else if</span> (value < root->info) {
        <span class="function">insert</span>(root->left, value);
    }
    <span class="keyword">else if</span> (value > root->info) {
        <span class="function">insert</span>(root->right, value);
    }
}`,
        delete: `<span class="keyword">void</span> <span class="function">deleteNode</span>(<span class="type">BinTree</span>& root, <span class="keyword">int</span> value) {
    <span class="keyword">if</span> (root == <span class="keyword">NULL</span>) <span class="keyword">return</span>;
    
    <span class="keyword">if</span> (value < root->info) {
        <span class="function">deleteNode</span>(root->left, value);
    }
    <span class="keyword">else if</span> (value > root->info) {
        <span class="function">deleteNode</span>(root->right, value);
    }
    <span class="keyword">else</span> {
        <span class="comment">// Jika node ditemukan</span>
        <span class="keyword">if</span> (root->left == <span class="keyword">NULL</span>) {
            <span class="type">address</span> temp = root->right;
            <span class="keyword">delete</span> root;
            root = temp;
        }
        <span class="keyword">else if</span> (root->right == <span class="keyword">NULL</span>) {
            <span class="type">address</span> temp = root->left;
            <span class="keyword">delete</span> root;
            root = temp;
        }
        <span class="keyword">else</span> {
            <span class="comment">// Cari successor (min di subtree kanan)</span>
            <span class="type">address</span> temp = root->right;
            <span class="keyword">while</span> (temp->left != <span class="keyword">NULL</span>)
                temp = temp->left;
            root->info = temp->info;
            <span class="function">deleteNode</span>(root->right, temp->info);
        }
    }
}`
    };
    
    algorithmCode.innerHTML = codes[algo] || '';
}

// BST Algorithm tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentBSTAlgo = e.target.dataset.algo;
        updateBSTAlgorithmCode(currentBSTAlgo);
    });
});

// BST Simulator Mode
let bstValues = [];
let currentBSTAlgo = 'insert';

document.getElementById('randomizeBST').addEventListener('click', () => {
    bstValues = currentTree.generateRandomBST();
    visualizer.setTree(currentTree);
    visualizer.draw();
    
    document.getElementById('bstOperations').style.display = 'block';
    document.getElementById('bstCodeViz').style.display = 'grid';
    document.getElementById('bstInfo').innerHTML = `<strong>Nilai yang dimasukkan:</strong>  ${bstValues.join(', ')}`;
    updateBSTAlgorithmCode(currentBSTAlgo);
});

document.getElementById('createCustomBST').addEventListener('click', () => {
    const input = document.getElementById('customNumbers').value.trim();
    
    if (!input) {
        showAlertModal('Silakan masukkan angka yang dipisahkan dengan spasi');
        return;
    }
    
    const numbers = input.split(/\s+/).map(n => parseInt(n)).filter(n => !isNaN(n));
    
    if (numbers.length === 0) {
        showAlertModal('Tidak ada angka yang valid');
        return;
    }
    
    currentTree.createBST(numbers);
    bstValues = numbers;
    visualizer.setTree(currentTree);
    visualizer.draw();
    
    document.getElementById('bstOperations').style.display = 'block';
    document.getElementById('bstCodeViz').style.display = 'grid';
    document.getElementById('bstInfo').innerHTML = `<strong>Nilai yang dimasukkan:</strong>  ${numbers.join(', ')}`;
    updateBSTAlgorithmCode(currentBSTAlgo);
});

document.getElementById('addNumber').addEventListener('click', () => {
    const input = document.getElementById('newNumber').value.trim();
    
    if (!input) {
        showAlertModal('Silakan masukkan angka');
        return;
    }
    
    const number = parseInt(input);
    
    if (isNaN(number)) {
        showAlertModal('Silakan masukkan angka yang valid');
        return;
    }
    
    const success = currentTree.insert(number);
    
    if (success) {
        bstValues.push(number);
        visualizer.setTree(currentTree);
        visualizer.draw();
        document.getElementById('bstInfo').innerHTML = `<strong>Angka ${number} berhasil ditambahkan!</strong><br>Nilai saat ini: ${bstValues.join(', ')}`;
        document.getElementById('newNumber').value = '';
    } else {
        showAlertModal(`Angka ${number} sudah ada di BST!`);
    }
});

document.getElementById('deleteNumberBtn').addEventListener('click', () => {
    const input = document.getElementById('deleteNumberInput').value.trim();
    
    if (!input) {
        showAlertModal('Silakan masukkan angka');
        return;
    }
    
    const number = parseInt(input);
    
    if (isNaN(number)) {
        showAlertModal('Silakan masukkan angka yang valid');
        return;
    }
    
    const success = currentTree.delete(number);
    
    if (success) {
        bstValues = bstValues.filter(v => v !== number);
        visualizer.setTree(currentTree);
        visualizer.draw();
        document.getElementById('bstInfo').innerHTML = `<strong>Angka ${number} berhasil dihapus!</strong><br>Nilai saat ini: ${bstValues.join(', ')}`;
        document.getElementById('deleteNumberInput').value = '';
    } else {
        showAlertModal(`Angka ${number} tidak ditemukan di BST!`);
    }
});

let buatTreeState = {
    tree: new BinaryTree(),
    selectedNode: null,
    selectedSide: null,
    modalAction: null
};

// Modal elements
const modal = document.getElementById('nodeModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const nodeValueInput = document.getElementById('nodeValue');
const modalConfirm = document.getElementById('modalConfirm');
const modalCancel = document.getElementById('modalCancel');
const modalClose = document.querySelector('.modal-close');

// Confirm Modal elements
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
let confirmCallback = null;

// Confirm Modal functions
function showConfirmModal(message, onConfirm) {
    confirmMessage.textContent = message;
    confirmCallback = onConfirm;
    confirmModal.classList.add('active');
}

function hideConfirmModal() {
    confirmModal.classList.remove('active');
    confirmCallback = null;
}

confirmYes.addEventListener('click', () => {
    if (confirmCallback) {
        confirmCallback(true);
    }
    hideConfirmModal();
});

confirmNo.addEventListener('click', () => {
    if (confirmCallback) {
        confirmCallback(false);
    }
    hideConfirmModal();
});

confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        if (confirmCallback) {
            confirmCallback(false);
        }
        hideConfirmModal();
    }
});

// Alert Modal elements
const alertModal = document.getElementById('alertModal');
const alertMessage = document.getElementById('alertMessage');
const alertOk = document.getElementById('alertOk');

// Alert Modal functions
function showAlertModal(message) {
    alertMessage.textContent = message;
    alertModal.classList.add('active');
}

function hideAlertModal() {
    alertModal.classList.remove('active');
}

alertOk.addEventListener('click', () => {
    hideAlertModal();
});

alertModal.addEventListener('click', (e) => {
    if (e.target === alertModal) {
        hideAlertModal();
    }
});

function initBuatTreeMode() {
    buatTreeState.tree = new BinaryTree();
    buatTreeState.selectedNode = null;
    visualizer.showPlaceholders = true;
    visualizer.zoom = 1.0;
    visualizer.offsetX = 0;
    visualizer.offsetY = 0;
    
    // Load persisted tree from session
    loadTreeFromSession();
    
    if (!buatTreeState.tree.root) {
        visualizer.setTree(null);
        visualizer.draw();
    }
    
    setupBuatTreeCanvas();
}

function setupBuatTreeCanvas() {
    canvas.onclick = null;
    
    // Add click handler for interactive canvas
    canvas.onclick = (e) => {
        if (currentMode !== 'buatTree') return;
        
        const rect = canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        
        const x = (canvasX - visualizer.offsetX) / visualizer.zoom;
        const y = (canvasY - visualizer.offsetY) / visualizer.zoom;
        
        const deleteResult = checkDeleteButtonClick(x, y);
        if (deleteResult) {
            deleteNodeInteractive(deleteResult);
            return;
        }
        
        const addButtonResult = checkAddButtonClick(x, y);
        if (addButtonResult) {
            showAddNodeModal(addButtonResult.node, addButtonResult.side);
            return;
        }
        
        const clickedNode = findNodeAtPosition(x, y);
        if (clickedNode) {
            showRenameModal(clickedNode);
            return;
        }
        
        const placeholderResult = findPlaceholderAtPosition(x, y);
        if (placeholderResult) {
            showAddNodeModal(placeholderResult.node, placeholderResult.side);
            return;
        }
    };
}

function findNodeAtPosition(x, y) {
    if (!buatTreeState.tree.root) return null;
    
    const depth = buatTreeState.tree.getDepth(buatTreeState.tree.root);
    const hSpacing = canvas.width / (Math.pow(2, depth) + 1);
    const vSpacing = 100; 
    
    return findNodeRecursive(buatTreeState.tree.root, x, y, hSpacing, vSpacing);
}

function findNodeRecursive(node, x, y, hSpacing, vSpacing) {
    if (!node) return null;
    
    const nodeX = (node.x + 0.5) * hSpacing;
    const nodeY = node.y * 100 + 50; 
    
    const distance = Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2));
    
    if (distance <= 25) {
        return node;
    }
    
    const leftResult = node.left ? findNodeRecursive(node.left, x, y, hSpacing, vSpacing) : null;
    if (leftResult) return leftResult;
    
    const rightResult = node.right ? findNodeRecursive(node.right, x, y, hSpacing, vSpacing) : null;
    if (rightResult) return rightResult;
    
    return null;
}

function findPlaceholderAtPosition(x, y) {
    if (!buatTreeState.tree.root) return null;
    
    const depth = buatTreeState.tree.getDepth(buatTreeState.tree.root);
    const hSpacing = canvas.width / (Math.pow(2, depth) + 1);
    const vSpacing = 100; 
    
    return findPlaceholderRecursive(buatTreeState.tree.root, x, y, hSpacing, vSpacing);
}

function findPlaceholderRecursive(node, x, y, hSpacing, vSpacing) {
    if (!node) return null;
    
    const nodeX = (node.x + 0.5) * hSpacing;
    const nodeY = node.y * 100 + 50; 
    const hasOnlyOneChild = (node.left && !node.right) || (!node.left && node.right);
    
    if (!node.left) {
        let placeholderX;
        if (hasOnlyOneChild) {
            placeholderX = nodeX - hSpacing / 3;
        } else {
            placeholderX = nodeX - hSpacing / 4;
        }
        const placeholderY = nodeY + 100; 
        const distance = Math.sqrt(Math.pow(x - placeholderX, 2) + Math.pow(y - placeholderY, 2));
        
        if (distance <= 20) {
            return { node: node, side: 'left' };
        }
    }
    
    if (!node.right) {
        let placeholderX;
        if (hasOnlyOneChild) {
            placeholderX = nodeX + hSpacing / 3;
        } else {
            placeholderX = nodeX + hSpacing / 4;
        }
        const placeholderY = nodeY + 100; 
        const distance = Math.sqrt(Math.pow(x - placeholderX, 2) + Math.pow(y - placeholderY, 2));
        
        if (distance <= 20) {
            return { node: node, side: 'right' };
        }
    }
    
    if (node.left) {
        const leftResult = findPlaceholderRecursive(node.left, x, y, hSpacing, vSpacing);
        if (leftResult) return leftResult;
    }
    
    if (node.right) {
        const rightResult = findPlaceholderRecursive(node.right, x, y, hSpacing, vSpacing);
        if (rightResult) return rightResult;
    }
    
    return null;
}

function checkDeleteButtonClick(x, y) {
    if (!buatTreeState.tree.root) return null;
    
    const depth = buatTreeState.tree.getDepth(buatTreeState.tree.root);
    const hSpacing = canvas.width / (Math.pow(2, depth) + 1);
    const vSpacing = 100; 
    
    return checkDeleteButtonRecursive(buatTreeState.tree.root, x, y, hSpacing, vSpacing);
}

function checkAddButtonClick(x, y) {
    if (!buatTreeState.tree.root) return null;
    
    const depth = buatTreeState.tree.getDepth(buatTreeState.tree.root);
    const hSpacing = canvas.width / (Math.pow(2, depth) + 1);
    const vSpacing = 100; 
    
    return checkAddButtonRecursive(buatTreeState.tree.root, x, y, hSpacing, vSpacing);
}

function checkDeleteButtonRecursive(node, x, y, hSpacing, vSpacing) {
    if (!node) return null;
    
    const nodeX = (node.x + 0.5) * hSpacing;
    const nodeY = node.y * 100 + 50; 
    
    const btnX = nodeX + 22;
    const btnY = nodeY - 22;
    
    const distance = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2));
    
    if (distance <= 10) {
        return node;
    }
    
    const leftResult = node.left ? checkDeleteButtonRecursive(node.left, x, y, hSpacing, vSpacing) : null;
    if (leftResult) return leftResult;
    
    const rightResult = node.right ? checkDeleteButtonRecursive(node.right, x, y, hSpacing, vSpacing) : null;
    if (rightResult) return rightResult;
    
    return null;
}

function checkAddButtonRecursive(node, x, y, hSpacing, vSpacing) {
    if (!node) return null;
    
    const nodeX = (node.x + 0.5) * hSpacing;
    const nodeY = node.y * 100 + 50;
    if (!node.left) {
        const btnX = nodeX - 22;
        const btnY = nodeY + 22;
        const distance = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2));
        
        if (distance <= 10) {
            return { node: node, side: 'left' };
        }
    }
    
    if (!node.right) {
        const btnX = nodeX + 22;
        const btnY = nodeY + 22;
        const distance = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2));
        
        if (distance <= 10) {
            return { node: node, side: 'right' };
        }
    }
    
    if (node.left) {
        const leftResult = checkAddButtonRecursive(node.left, x, y, hSpacing, vSpacing);
        if (leftResult) return leftResult;
    }
    
    if (node.right) {
        const rightResult = checkAddButtonRecursive(node.right, x, y, hSpacing, vSpacing);
        if (rightResult) return rightResult;
    }
    
    return null;
}

// Modal functions
function showModal() {
    modal.classList.add('active');
    setTimeout(() => nodeValueInput.focus(), 100);
}

function hideModal() {
    modal.classList.remove('active');
    nodeValueInput.value = '';
    buatTreeState.modalAction = null;
}

function showAddNodeModal(parentNode, side) {
    buatTreeState.selectedNode = parentNode;
    buatTreeState.selectedSide = side;
    buatTreeState.modalAction = 'add';
    
    modalTitle.textContent = `Tambah ${side === 'left' ? 'Left' : 'Right'} Child`;
    nodeValueInput.placeholder = 'Masukkan nilai node...';
    nodeValueInput.value = '';
    
    showModal();
}

function showRenameModal(node) {
    buatTreeState.selectedNode = node;
    buatTreeState.modalAction = 'rename';
    
    modalTitle.textContent = 'Rename Node';
    nodeValueInput.placeholder = 'Masukkan nilai baru...';
    nodeValueInput.value = node.value;
    
    showModal();
}

// Modal event handlers
modalConfirm.addEventListener('click', () => {
    const value = nodeValueInput.value.trim();
    
    if (!value) {
        showAlertModal('Nilai node tidak boleh kosong!');
        return;
    }
    
    if (value.length > 10) {
        showAlertModal('Nilai node maksimal 10 karakter!');
        return;
    }
    
    if (buatTreeState.modalAction === 'createRoot') {
        buatTreeState.tree.root = new TreeNode(value);
        buatTreeState.tree.calculatePositions();
        visualizer.setTree(buatTreeState.tree);
        visualizer.draw();
    } else if (buatTreeState.modalAction === 'add') {
        const newNode = new TreeNode(value);
        
        if (buatTreeState.selectedSide === 'left') {
            buatTreeState.selectedNode.left = newNode;
        } else {
            buatTreeState.selectedNode.right = newNode;
        }
        
        buatTreeState.tree.calculatePositions();
        visualizer.setTree(buatTreeState.tree);
        visualizer.draw();
    } else if (buatTreeState.modalAction === 'rename') {
        buatTreeState.selectedNode.value = value;
        visualizer.draw();
    }
    
    saveTreeToSession();
    hideModal();
});

modalCancel.addEventListener('click', hideModal);
modalClose.addEventListener('click', hideModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});

nodeValueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        modalConfirm.click();
    }
});

function deleteNodeInteractive(node) {
    if (node === buatTreeState.tree.root && !node.left && !node.right) {
        showConfirmModal('Hapus root node?', (confirmed) => {
            if (confirmed) {
                buatTreeState.tree.root = null;
                visualizer.setTree(null);
                visualizer.draw();
                saveTreeToSession();
            }
        });
        return;
    }
    
    showConfirmModal(`Hapus node ${node.value}? Node ini dan semua child-nya akan dihapus.`, (confirmed) => {
        if (!confirmed) return;
        
        removeNodeFromTree(buatTreeState.tree.root, node, null, null);
        buatTreeState.tree.calculatePositions();
        visualizer.setTree(buatTreeState.tree);
        visualizer.draw();
        saveTreeToSession();
    });
}

function removeNodeFromTree(current, targetNode, parent, isLeft) {
    if (!current) return false;
    
    if (current === targetNode) {
        if (!parent) {
            buatTreeState.tree.root = null;
        } else if (isLeft) {
            parent.left = null;
        } else {
            parent.right = null;
        }
        return true;
    }
    
    if (removeNodeFromTree(current.left, targetNode, current, true)) return true;
    if (removeNodeFromTree(current.right, targetNode, current, false)) return true;
    
    return false;
}

document.getElementById('createRoot').addEventListener('click', () => {
    if (buatTreeState.tree.root) {
        showAlertModal('Root sudah ada! Hapus tree terlebih dahulu.');
        return;
    }
    
    buatTreeState.selectedNode = null;
    buatTreeState.modalAction = 'createRoot';
    
    modalTitle.textContent = 'Buat Root Node';
    nodeValueInput.placeholder = 'Masukkan nilai root...';
    nodeValueInput.value = '';
    
    showModal();
});

document.getElementById('clearTree').addEventListener('click', () => {
    if (!buatTreeState.tree.root) {
        showAlertModal('Tree sudah kosong!');
        return;
    }
    
    showConfirmModal('Hapus seluruh tree?', (confirmed) => {
        if (confirmed) {
            buatTreeState.tree = new BinaryTree();
            visualizer.setTree(null);
            visualizer.draw();
            saveTreeToSession();
        }
    });
});

document.getElementById('showPlaceholdersCheckbox').addEventListener('change', (e) => {
    visualizer.showPlaceholders = e.target.checked;
    visualizer.draw();
});

document.getElementById('simplifyOnlyChildCheckbox').addEventListener('change', (e) => {
    visualizer.simplifyOnlyChild = e.target.checked;
    visualizer.draw();
    saveTreeToSession();
});

// Color customization
document.getElementById('nodeFillColor').addEventListener('input', (e) => {
    visualizer.nodeFillColor = e.target.value;
    visualizer.draw();
});

document.getElementById('nodeStrokeColor').addEventListener('input', (e) => {
    visualizer.nodeStrokeColor = e.target.value;
    visualizer.draw();
});

document.getElementById('nodeTextColor').addEventListener('input', (e) => {
    visualizer.nodeTextColor = e.target.value;
    visualizer.draw();
});

// Download Image
document.getElementById('downloadImage').addEventListener('click', () => {
    if (!buatTreeState.tree.root) {
        showAlertModal('Tidak ada tree untuk di-download!');
        return;
    }
    
    // Temporarily hide button
    const wasShowingPlaceholders = visualizer.showPlaceholders;
    visualizer.showPlaceholders = false;
    visualizer.draw();
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tree.png';
        a.click();
        URL.revokeObjectURL(url);
        
        visualizer.showPlaceholders = wasShowingPlaceholders;
        visualizer.draw();
    });
});

// Session Storage Functions
function saveTreeToSession() {
    if (buatTreeState.tree.root) {
        const treeData = serializeTree(buatTreeState.tree.root);
        sessionStorage.setItem('buatTreeData', JSON.stringify(treeData));
    } else {
        sessionStorage.removeItem('buatTreeData');
    }
    sessionStorage.setItem('simplifyOnlyChild', visualizer.simplifyOnlyChild);
}

function loadTreeFromSession() {
    const savedData = sessionStorage.getItem('buatTreeData');
    if (savedData) {
        try {
            const treeData = JSON.parse(savedData);
            buatTreeState.tree.root = deserializeTree(treeData);
            buatTreeState.tree.calculatePositions();
            visualizer.setTree(buatTreeState.tree);
            visualizer.draw();
        } catch (error) {
            console.error('Error loading tree from session:', error);
        }
    }
    const savedSimplify = sessionStorage.getItem('simplifyOnlyChild');
    if (savedSimplify !== null) {
        visualizer.simplifyOnlyChild = savedSimplify === 'true';
        document.getElementById('simplifyOnlyChildCheckbox').checked = visualizer.simplifyOnlyChild;
    }
}

document.getElementById('exportJSON').addEventListener('click', () => {
    if (!buatTreeState.tree.root) {
        showAlertModal('Tidak ada tree untuk di-export!');
        return;
    }
    
    const treeData = serializeTree(buatTreeState.tree.root);
    const jsonString = JSON.stringify(treeData, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tree.json';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('importJSONBuilder').addEventListener('click', () => {
    document.getElementById('jsonFileInputBuilder').click();
});

document.getElementById('jsonFileInputBuilder').addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const treeData = JSON.parse(event.target.result);
            buatTreeState.tree.root = deserializeTree(treeData);
            buatTreeState.tree.calculatePositions();
            visualizer.setTree(buatTreeState.tree);
            visualizer.draw();
            saveTreeToSession();
        } catch (error) {
            showAlertModal('Error membaca file JSON: ' + error.message);
        }
    };
    
    reader.readAsText(file);
    e.target.value = ''; 
});

document.getElementById('importJSON').addEventListener('click', () => {
    document.getElementById('jsonFileInput').click();
});

document.getElementById('loadFromBuatTree').addEventListener('click', () => {
    const savedData = sessionStorage.getItem('buatTreeData');
    
    if (!savedData) {
        showAlertModal('Tidak ada tree yang tersimpan di Buat Tree mode!');
        return;
    }
    
    try {
        const treeData = JSON.parse(savedData);
        currentTree.root = deserializeTree(treeData);
        currentTree.calculatePositions();
        visualizer.setTree(currentTree);
        visualizer.draw();
        
        document.getElementById('traversalControls').style.display = 'block';
        document.getElementById('traversalOutput').textContent = 'Tree berhasil di-load.';
    } catch (error) {
        showAlertModal('Error membaca tree dari session: ' + error.message);
    }
});

document.getElementById('jsonFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const treeData = JSON.parse(event.target.result);
            currentTree.root = deserializeTree(treeData);
            currentTree.calculatePositions();
            visualizer.setTree(currentTree);
            visualizer.draw();
            
            document.getElementById('traversalControls').style.display = 'block';
            document.getElementById('traversalOutput').textContent = 'Tree berhasil di-import! Pilih jenis traversal.';
        } catch (error) {
            showAlertModal('Error membaca file JSON: ' + error.message);
        }
    };
    
    reader.readAsText(file);
    e.target.value = ''; 
});

// Serialize tree to JSON
function serializeTree(node) {
    if (!node) return null;
    
    return {
        value: node.value,
        left: serializeTree(node.left),
        right: serializeTree(node.right)
    };
}

// Deserialize tree from JSON
function deserializeTree(data) {
    if (!data) return null;
    
    const node = new TreeNode(data.value);
    node.left = deserializeTree(data.left);
    node.right = deserializeTree(data.right);
    
    return node;
}

// Zoom Controls
document.getElementById('zoomIn').addEventListener('click', () => {
    visualizer.setZoom(visualizer.zoom * 1.2);
});

document.getElementById('zoomOut').addEventListener('click', () => {
    visualizer.setZoom(visualizer.zoom / 1.2);
});

document.getElementById('zoomReset').addEventListener('click', () => {
    visualizer.resetZoom();
});
