import React from "react";
import PropTypes from "prop-types";
import Tree, {TreeNode} from 'rc-tree';

class RadioTree extends React.Component {
    // TODO: expandAll 失效了
    static propTypes = {
        multiple: PropTypes.bool,
    };
    static defaultProps = {
        visible: false,
        multiple: true,
    };

    state = {
        // expandedKeys: getFilterExpandedKeys(gData, ['0-0-0-key']),
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        checkStrictlyKeys: {checked: [], halfChecked: []},
        selectedKeys: [],
        treeData: [],
    };

    constructor(props) {
        super(props);
        this.style = props.style;
        this.onCheckKeys = props.onCheckKeys;
        this.treeData = props.treeData;

    }

    componentDidMount() {
        this.setState({
            treeData: this.treeData
        })
    }

    componentWillReceiveProps(nextProps) {
        this.treeData = nextProps.treeData;
        this.setState({
            treeData: this.treeData
        })

    }


    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded chilren keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck = (checkedKeys) => {
        console.log(checkedKeys);
        this.setState({
            checkedKeys,
        });
        this.onCheckKeys(checkedKeys)
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', selectedKeys, info);
        this.setState({
            selectedKeys,
        });

    }
    triggerChecked = () => {
        // this.setState({
        //     checkedKeys: [`0-0-${parseInt(Math.random() * 3, 10)}-key`],
        // });
    }

    render() {
        /**
         * value format: [{ key: "key", title: "child", children:["", ""]}]
         */
        const loop = data => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode
                            key={item.key} title={item.title}
                            // disableCheckbox={item.key === '0-0-0-key'}
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} title={item.title}/>;
            });
        };


        // console.log(getRadioSelectKeys(gData, this.state.selectedKeys));
        return (<div style={this.style}>


            <h2>controlled</h2>
            <Tree
                checkable
                onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
                defaultExpandAll
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
            >
                {loop(this.state.treeData)}
            </Tree>
            {/*<button onClick={this.triggerChecked}>trigger checked</button>*/}
        </div>);
    }
}

export default RadioTree;