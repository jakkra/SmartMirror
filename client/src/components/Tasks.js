import React from 'react';

import BaseComponent from './BaseComponent';

import { getTasks, getPlantMoistureLevel } from '../lib/fetch';
import FlipMove from 'react-flip-move';
import FA from 'react-fontawesome';

const styles = {
  container: {
    marginLeft: -15,
    marginTop: '10%',
  },
  taskTitle: {
    color: 'white',
    fontSize: '1.7em',
    textAlign: 'left',
    paddingLeft: 15,
  },
  listName: {
    color: 'white',
    fontSize: '2.4em',
    textAlign: 'left',
    marginBottom: 7,
  },
  icon: {
    color: 'white',
    marginLeft: 15,
    fontSize: '0.9em'
  },
  waterPlantText: {
    color: 'white',
    fontSize: '2em',
  },
}

export default class Tasks extends BaseComponent {

  static propTypes = {
    visible: React.PropTypes.bool,
    phrases: React.PropTypes.object,
  };

  static defaultProps = {
    visible: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      subTasks: [],
      numTasks: 6,
      moistureLevel: 54,
    };
    this.refreshTasks = this.refreshTasks.bind(this);
    this.handleNewTasks = this.handleNewTasks.bind(this);
    this.rotateList = this.rotateList.bind(this);
    this.handleNewMoistureLog = this.handleNewMoistureLog.bind(this);
  }

  componentDidMount() {
    this.refreshTimer = setInterval(
      () => this.refreshTasks(),
      1000 * 10 
    );
    this.refreshTasks();

    this.rotatetasksTimer = setInterval(
      () => this.rotateList(),
      1000 * 2
    );
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
    clearInterval(this.rotatetasksTimer);
  }

  refreshTasks() {
    getTasks()
    .then(this.handleNewTasks)
    .catch((err) => console.log(err));

    getPlantMoistureLevel()
    .then(this.handleNewMoistureLog)
    .catch((err) => console.log(err));
  }

  handleNewTasks(tasks) {
    this.setState({
      tasks: tasks,
      subTasks: tasks.slice(0, this.state.numTasks)
    })
  }

  handleNewMoistureLog(moistureLogging) {
    console.log(moistureLogging)
    this.setState({
      moistureLevel: moistureLogging.moisture,
    })
  }

  rotateList(){
    if(this.state.tasks.length < this.state.numTasks){
      return;
    }
    const tasks = this.state.tasks.slice();
    tasks.unshift(tasks.pop())

    this.setState({
      tasks: tasks,
      subTasks: tasks.slice(0, this.state.numTasks)
    });
  }

  renderTaskList() {
    if (this.state.tasks.length < 1) return null;
    return (
      <div>
        <div style={styles.listName}>
        {this.props.phrases.shopping_list}
        <FA
          name='shopping-basket'
          style={styles.icon}
        />
      </div>
      <FlipMove 
        staggerDurationBy="30"
        duration={500}
        enterAnimation='accordianVertical'
        leaveAnimation='accordianVertical'
        typeName="div"
      >
        { this.renderTopTasksItems() }
      </FlipMove>
    </div>
    )
  }

  renderTopTasksItems() {
    return this.state.subTasks.map((task, i) => {
      return (
        <div key={task.id}>
          <div style={styles.taskTitle}> &#x26AB; {task.title} </div>
        </div>
      );
    });
  }

  renderWaterPlant() {
    if (this.state.moistureLevel > 70) return null;
    return (
      <div style={styles.listName}>
          {this.props.phrases.water_plant + " (~" + this.state.moistureLevel + "%)"}
          <FA
            name='tint'
            style={styles.icon}
          />
        </div>
      )
  }

  render() {
    return (
      <div hidden={!this.props.visible} style={styles.container}>
        {this.renderWaterPlant()}
        {this.renderTaskList()}
        }
      </div>
    );
  }
}
