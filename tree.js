// Binary Tree Node
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

// Binary Tree
class BinaryTree {
    constructor() {
        this.root = null;
        this.nodes = [];
    }

    // Generate random tree with specified depth and node count
    generateRandomTree(maxDepth, nodeCount) {
        this.root = null;
        this.nodes = [];
        
        if (nodeCount <= 0) return;

        // Generate unique values (letters)
        const values = this.generateValues(nodeCount);
        
        // Create root
        this.root = new TreeNode(values[0]);
        this.nodes.push(this.root);
        
        // Available positions for insertion (with depth tracking)
        let availablePositions = [{ node: this.root, depth: 1 }];
        
        // Insert remaining nodes
        for (let i = 1; i < nodeCount; i++) {
            if (availablePositions.length === 0) break;
            
            // Filter positions that haven't exceeded max depth
            availablePositions = availablePositions.filter(pos => pos.depth < maxDepth);
            if (availablePositions.length === 0) break;
            
            // Randomly select a position
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            const { node, depth } = availablePositions[randomIndex];
            
            const newNode = new TreeNode(values[i]);
            this.nodes.push(newNode);
            
            // Randomly choose left or right
            if (!node.left && !node.right) {
                // If both are empty, randomly choose
                if (Math.random() < 0.5) {
                    node.left = newNode;
                } else {
                    node.right = newNode;
                }
            } else if (!node.left) {
                node.left = newNode;
            } else if (!node.right) {
                node.right = newNode;
            }
            
            // Add new positions if depth allows
            if (depth + 1 < maxDepth) {
                availablePositions.push({ node: newNode, depth: depth + 1 });
            }
            
            // Remove current position if both children are filled
            if (node.left && node.right) {
                availablePositions.splice(randomIndex, 1);
            }
        }
        
        this.calculatePositions();
    }

    // Generate unique letter values
    generateValues(count) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const shuffled = letters.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    // Calculate positions for visualization
    calculatePositions(simplifyOnlyChild = true) {
        if (!this.root) return;
        
        const depth = this.getDepth(this.root);
        const width = Math.pow(2, depth) - 1;
        
        this.assignPositions(this.root, 0, width, 0, depth, simplifyOnlyChild);
    }

    assignPositions(node, left, right, level, maxDepth, simplifyOnlyChild = true) {
        if (!node) return;
        
        const mid = (left + right) / 2;
        node.x = mid;
        node.y = level;
        
        // If simplifyOnlyChild is enabled and only one child exists, center it below parent
        if (simplifyOnlyChild && node.left && !node.right) {
            // Only left child - center it below parent
            this.assignPositions(node.left, left, right, level + 1, maxDepth, simplifyOnlyChild);
        } else if (simplifyOnlyChild && !node.left && node.right) {
            // Only right child - center it below parent
            this.assignPositions(node.right, left, right, level + 1, maxDepth, simplifyOnlyChild);
        } else if (node.left && node.right) {
            // Both children - normal split
            this.assignPositions(node.left, left, mid, level + 1, maxDepth, simplifyOnlyChild);
            this.assignPositions(node.right, mid, right, level + 1, maxDepth, simplifyOnlyChild);
        } else if (node.left) {
            // Left child only, traditional positioning
            this.assignPositions(node.left, left, mid, level + 1, maxDepth, simplifyOnlyChild);
        } else if (node.right) {
            // Right child only, traditional positioning
            this.assignPositions(node.right, mid, right, level + 1, maxDepth, simplifyOnlyChild);
        }
    }

    getDepth(node) {
        if (!node) return 0;
        return 1 + Math.max(this.getDepth(node.left), this.getDepth(node.right));
    }

    // Traversal methods
    preorder(node = this.root, result = []) {
        if (!node) return result;
        result.push(node.value);
        this.preorder(node.left, result);
        this.preorder(node.right, result);
        return result;
    }

    inorder(node = this.root, result = []) {
        if (!node) return result;
        this.inorder(node.left, result);
        result.push(node.value);
        this.inorder(node.right, result);
        return result;
    }

    postorder(node = this.root, result = []) {
        if (!node) return result;
        this.postorder(node.left, result);
        this.postorder(node.right, result);
        result.push(node.value);
        return result;
    }

    levelorder() {
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node.value);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        return result;
    }

    // Get traversal order with node references
    getTraversalOrder(type) {
        const order = [];
        
        switch(type) {
            case 'preorder':
                this.preorderWithNodes(this.root, order);
                break;
            case 'inorder':
                this.inorderWithNodes(this.root, order);
                break;
            case 'postorder':
                this.postorderWithNodes(this.root, order);
                break;
            case 'levelorder':
                this.levelorderWithNodes(order);
                break;
        }
        
        return order;
    }

    preorderWithNodes(node, result) {
        if (!node) return;
        result.push(node);
        this.preorderWithNodes(node.left, result);
        this.preorderWithNodes(node.right, result);
    }

    inorderWithNodes(node, result) {
        if (!node) return;
        this.inorderWithNodes(node.left, result);
        result.push(node);
        this.inorderWithNodes(node.right, result);
    }

    postorderWithNodes(node, result) {
        if (!node) return;
        this.postorderWithNodes(node.left, result);
        this.postorderWithNodes(node.right, result);
        result.push(node);
    }

    levelorderWithNodes(result) {
        if (!this.root) return;
        
        const queue = [this.root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }

    // Clone tree for manipulation
    clone() {
        const newTree = new BinaryTree();
        newTree.root = this.cloneNode(this.root);
        newTree.calculatePositions();
        return newTree;
    }

    cloneNode(node) {
        if (!node) return null;
        
        const newNode = new TreeNode(node.value);
        newNode.left = this.cloneNode(node.left);
        newNode.right = this.cloneNode(node.right);
        return newNode;
    }

    // Calculate max nodes for a given depth
    static getMaxNodes(depth) {
        return Math.pow(2, depth) - 1;
    }

    // Insert value into BST
    insert(value) {
        const newNode = new TreeNode(value);
        
        if (!this.root) {
            this.root = newNode;
            this.nodes.push(newNode);
            this.calculatePositions();
            return true;
        }
        
        // Check for duplicates
        if (this.findNode(value)) {
            return false; // Duplicate value
        }
        
        this.insertNode(this.root, newNode);
        this.nodes.push(newNode);
        this.calculatePositions();
        return true;
    }

    insertNode(root, newNode) {
        if (newNode.value < root.value) {
            if (!root.left) {
                root.left = newNode;
            } else {
                this.insertNode(root.left, newNode);
            }
        } else {
            if (!root.right) {
                root.right = newNode;
            } else {
                this.insertNode(root.right, newNode);
            }
        }
    }

    findNode(value, node = this.root) {
        if (!node) return null;
        
        if (value === node.value) return node;
        if (value < node.value) return this.findNode(value, node.left);
        return this.findNode(value, node.right);
    }

    // Delete node from BST
    delete(value) {
        if (!this.root) return false;
        
        const result = this.deleteNode(this.root, value, null, null);
        if (result) {
            this.nodes = this.nodes.filter(n => n.value !== value);
            this.calculatePositions();
            return true;
        }
        return false;
    }

    deleteNode(node, value, parent, isLeft) {
        if (!node) return false;
        
        if (value < node.value) {
            return this.deleteNode(node.left, value, node, true);
        } else if (value > node.value) {
            return this.deleteNode(node.right, value, node, false);
        } else {
            // Found the node to delete
            
            // Case 1: Leaf node (no children)
            if (!node.left && !node.right) {
                if (!parent) {
                    this.root = null;
                } else if (isLeft) {
                    parent.left = null;
                } else {
                    parent.right = null;
                }
                return true;
            }
            
            // Case 2: One child
            if (!node.left) {
                if (!parent) {
                    this.root = node.right;
                } else if (isLeft) {
                    parent.left = node.right;
                } else {
                    parent.right = node.right;
                }
                return true;
            }
            
            if (!node.right) {
                if (!parent) {
                    this.root = node.left;
                } else if (isLeft) {
                    parent.left = node.left;
                } else {
                    parent.right = node.left;
                }
                return true;
            }
            
            // Case 3: Two children
            // Find inorder successor (smallest in right subtree)
            let successorParent = node;
            let successor = node.right;
            
            while (successor.left) {
                successorParent = successor;
                successor = successor.left;
            }
            
            // Replace node's value with successor's value
            node.value = successor.value;
            
            // Delete the successor
            if (successorParent === node) {
                successorParent.right = successor.right;
            } else {
                successorParent.left = successor.right;
            }
            
            return true;
        }
    }

    // Create BST from array of values
    createBST(values) {
        this.root = null;
        this.nodes = [];
        
        values.forEach(value => {
            this.insert(value);
        });
    }

    // Generate random BST
    generateRandomBST(count = null) {
        if (!count) {
            count = Math.floor(Math.random() * 5) + 8; // 8-12 nodes
        }
        
        const values = [];
        const used = new Set();
        
        while (values.length < count) {
            const value = Math.floor(Math.random() * 100) + 1; // 1-100
            if (!used.has(value)) {
                values.push(value);
                used.add(value);
            }
        }
        
        this.createBST(values);
        return values;
    }
}

// Tree Visualizer
class TreeVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tree = null;
        this.hiddenNodes = new Set();
        this.highlightedNode = null;
        this.visitedNodes = new Set();
        this.showPlaceholders = false;
        this.simplifyOnlyChild = true;
        this.zoom = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.nodeFillColor = '#2196F3';
        this.nodeStrokeColor = '#1976D2';
        this.nodeTextColor = '#ffffff';
        this.setupPanAndZoom();
    }

    setTree(tree) {
        this.tree = tree;
        this.hiddenNodes.clear();
        this.highlightedNode = null;
        this.visitedNodes.clear();
        
        // Auto-center on root with appropriate zoom
        if (tree && tree.root) {
            this.centerOnRoot();
        } else {
            this.draw();
        }
    }

    draw() {
        if (!this.tree || !this.tree.root) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Recalculate positions with current simplifyOnlyChild setting
        this.tree.calculatePositions(this.simplifyOnlyChild);
        
        // Save context state
        this.ctx.save();
        
        // Apply zoom and pan transformations
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.zoom, this.zoom);
        
        const depth = this.tree.getDepth(this.tree.root);
        const horizontalSpacing = this.canvas.width / (Math.pow(2, depth) + 1);
        const verticalSpacing = 100; // Fixed spacing between levels
        
        this.drawNode(this.tree.root, horizontalSpacing, verticalSpacing);
        
        // Restore context state
        this.ctx.restore();
    }
    
    centerOnRoot() {
        if (!this.tree || !this.tree.root) return;
        
        const depth = this.tree.getDepth(this.tree.root);
        const horizontalSpacing = this.canvas.width / (Math.pow(2, depth) + 1);
        const verticalSpacing = 100; // Fixed spacing between levels
        
        // Calculate root position
        const rootX = (this.tree.root.x + 0.5) * horizontalSpacing;
        const rootY = this.tree.root.y * verticalSpacing + 50;
        
        // Calculate total tree height
        const totalHeight = depth * verticalSpacing + 100;
        
        // Center canvas on root with appropriate zoom for depth
        const targetZoom = Math.min(1.0, Math.max(0.3, this.canvas.height / totalHeight));
        this.zoom = targetZoom;
        
        // Position root at center of canvas
        this.offsetX = (this.canvas.width / 2) - (rootX * this.zoom);
        this.offsetY = 50 - (rootY * this.zoom);
        
        this.draw();
    }

    drawNode(node, hSpacing, vSpacing) {
        if (!node || this.hiddenNodes.has(node)) return;
        
        const x = (node.x + 0.5) * hSpacing;
        const y = node.y * vSpacing + 50;
        
        // Draw lines to children first
        if (node.left && !this.hiddenNodes.has(node.left)) {
            const childX = (node.left.x + 0.5) * hSpacing;
            const childY = node.left.y * vSpacing + 50;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(childX, childY);
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        if (node.right && !this.hiddenNodes.has(node.right)) {
            const childX = (node.right.x + 0.5) * hSpacing;
            const childY = node.right.y * vSpacing + 50;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(childX, childY);
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        // Draw placeholders for missing children in interactive mode
        if (this.showPlaceholders) {
            // If node has only one child, that child is centered, so offset the placeholder
            const hasOnlyOneChild = (node.left && !node.right) || (!node.left && node.right);
            
            if (!node.left) {
                let placeholderX, placeholderY;
                if (hasOnlyOneChild) {
                    // If right child exists and is centered, place left placeholder to the left
                    placeholderX = x - hSpacing / 3;
                    placeholderY = y + vSpacing;
                } else {
                    placeholderX = x - hSpacing / 4;
                    placeholderY = y + vSpacing;
                }
                this.drawPlaceholder(placeholderX, placeholderY, x, y);
            }
            if (!node.right) {
                let placeholderX, placeholderY;
                if (hasOnlyOneChild) {
                    // If left child exists and is centered, place right placeholder to the right
                    placeholderX = x + hSpacing / 3;
                    placeholderY = y + vSpacing;
                } else {
                    placeholderX = x + hSpacing / 4;
                    placeholderY = y + vSpacing;
                }
                this.drawPlaceholder(placeholderX, placeholderY, x, y);
            }
        }
        
        // Draw node
        this.ctx.beginPath();
        this.ctx.arc(x, y, 25, 0, 2 * Math.PI);
        
        if (this.highlightedNode === node) {
            this.ctx.fillStyle = '#4CAF50'; // Green for current node
        } else if (this.visitedNodes.has(node)) {
            this.ctx.fillStyle = '#f44336'; // Red for visited nodes
        } else {
            this.ctx.fillStyle = this.nodeFillColor; // Use custom color
        }
        
        this.ctx.fill();
        this.ctx.strokeStyle = this.nodeStrokeColor; // Use custom stroke color
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Draw text with dynamic font size
        this.ctx.fillStyle = this.nodeTextColor; // Use custom text color
        
        // Calculate font size based on text length
        const textLength = String(node.value).length;
        let fontSize;
        if (textLength <= 2) {
            fontSize = 18;
        } else if (textLength <= 4) {
            fontSize = 16;
        } else if (textLength <= 6) {
            fontSize = 14;
        } else if (textLength <= 8) {
            fontSize = 12;
        } else {
            fontSize = 10;
        }
        
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.value, x, y);
        
        // Draw interactive buttons in build mode
        if (this.showPlaceholders) {
            this.drawDeleteButton(x, y);
            this.drawAddButtons(node, x, y);
        }
        
        // Recursively draw children
        if (node.left) this.drawNode(node.left, hSpacing, vSpacing);
        if (node.right) this.drawNode(node.right, hSpacing, vSpacing);
    }
    
    drawPlaceholder(x, y, parentX, parentY) {
        // Draw line to placeholder
        this.ctx.beginPath();
        this.ctx.moveTo(parentX, parentY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw placeholder circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fill();
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([3, 3]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw plus sign
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 8, y);
        this.ctx.lineTo(x + 8, y);
        this.ctx.moveTo(x, y - 8);
        this.ctx.lineTo(x, y + 8);
        this.ctx.stroke();
    }
    
    drawDeleteButton(x, y) {
        const btnX = x + 22;
        const btnY = y - 22;
        
        // Draw delete button circle
        this.ctx.beginPath();
        this.ctx.arc(btnX, btnY, 10, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fill();
        
        // Draw X
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(btnX - 4, btnY - 4);
        this.ctx.lineTo(btnX + 4, btnY + 4);
        this.ctx.moveTo(btnX + 4, btnY - 4);
        this.ctx.lineTo(btnX - 4, btnY + 4);
        this.ctx.stroke();
    }
    
    drawAddButtons(node, x, y) {
        // Draw L button (left child) if no left child exists
        if (!node.left) {
            const btnX = x - 22;
            const btnY = y + 22;
            
            // Draw L button circle
            this.ctx.beginPath();
            this.ctx.arc(btnX, btnY, 10, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#28a745';
            this.ctx.fill();
            
            // Draw L text
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('L', btnX, btnY);
        }
        
        // Draw R button (right child) if no right child exists
        if (!node.right) {
            const btnX = x + 22;
            const btnY = y + 22;
            
            // Draw R button circle
            this.ctx.beginPath();
            this.ctx.arc(btnX, btnY, 10, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#28a745';
            this.ctx.fill();
            
            // Draw R text
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('R', btnX, btnY);
        }
    }

    hideNode(node) {
        this.hiddenNodes.add(node);
    }

    highlightNode(node) {
        this.highlightedNode = node;
    }

    markVisited(node) {
        this.visitedNodes.add(node);
    }

    reset() {
        this.hiddenNodes.clear();
        this.highlightedNode = null;
        this.visitedNodes.clear();
    }
    
    setupPanAndZoom() {
        // Mouse wheel zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.max(0.1, Math.min(5, this.zoom * zoomFactor));
            
            // Zoom towards mouse position
            const scale = newZoom / this.zoom;
            this.offsetX = mouseX - (mouseX - this.offsetX) * scale;
            this.offsetY = mouseY - (mouseY - this.offsetY) * scale;
            
            this.zoom = newZoom;
            this.draw();
        }, { passive: false });
        
        // Pan with middle mouse or ctrl+drag
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
                e.preventDefault();
                this.isDragging = true;
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                this.canvas.style.cursor = 'grabbing';
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const dx = e.clientX - this.lastMouseX;
                const dy = e.clientY - this.lastMouseY;
                
                this.offsetX += dx;
                this.offsetY += dy;
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                
                this.draw();
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 1 || (e.button === 0 && this.isDragging)) {
                this.isDragging = false;
                this.canvas.style.cursor = 'pointer';
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.canvas.style.cursor = 'pointer';
            }
        });
    }
    
    setZoom(zoomLevel) {
        this.zoom = Math.max(0.1, Math.min(5, zoomLevel));
        this.draw();
    }
    
    resetZoom() {
        // Reset to center on root with automatic zoom
        this.centerOnRoot();
    }
}
