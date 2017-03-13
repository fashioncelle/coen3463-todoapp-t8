import React, { Component } from 'react';
import { connect, PromiseState } from 'react-refetch';
import TaskCard from './TaskCard';

class Taskstodo extends Component {
	constructor(props) {
        super(props);

        this.state = {tasksFilter: 'allTasks'};
        this.handleTasksFilterState = this.handleTasksFilterState.bind(this);
        this.handleAddTask = this.handleAddTask.bind(this);
        this.handleDeleteFinishedTasksSubmit = this.handleDeleteFinishedTasksSubmit.bind(this);
        this.handleEditTaskNameSubmit = this.handleEditTaskNameSubmit.bind(this);
        this.handleEditTaskStatusSubmit = this.handleEditTaskStatusSubmit.bind(this);
        this.handleDeleteTaskSubmit = this.handleDeleteTaskSubmit.bind(this);
    }
    handleTasksFilterState(event) {
        event.preventDefault();

        this.setState({tasksFilter: event.target.value});
    }
    handleAddTask(event) {
        event.preventDefault();

        const { user, addTask } = this.props;

        addTask(user._id);
    }
    handleDeleteFinishedTasksSubmit(event) {
        event.preventDefault();

        const { user, deleteFinishedTasks } = this.props;

        deleteFinishedTasks(user._id);
    }
    handleEditTaskNameSubmit(userID, taskID, updateTask) {
        const { editTask } = this.props;

        editTask(userID, taskID, updateTask);
    }
    handleEditTaskStatusSubmit(userID, taskID, updateTask) {
        const { editTask } = this.props;

        editTask(userID, taskID, updateTask);
    }
    handleDeleteTaskSubmit(userID, taskID) {
        const { deleteTask } = this.props;

        deleteTask(userID, taskID);
    }
    render() {
    	const { userTasksDataFetch } = this.props;
        const allUserTasksDataFetch = PromiseState.all([userTasksDataFetch]);

         if (allUserTasksDataFetch.pending) {
            return (
              <div className="progress">
              <div className="indeterminate"/>
             </div>
          )
        }
        else if (allUserTasksDataFetch.fulfilled) {
            const [ userTasksData ] = allUserTasksDataFetch.value;
            const userTasks = userTasksData.userTasks;
            const { user } = this.props;
            const { tasksFilter } = this.state;
            const {
                handleTasksFilterState,
                handleAddTask,
                handleDeleteFinishedTasksSubmit,
                handleEditTaskNameSubmit,
                handleEditTaskStatusSubmit,
                handleDeleteTaskSubmit
            } = this;

            return(
            	<div className="body">
                    <nav>
                        <div className="nav-wrapper">
                            <a href="#!" class="brand-logo">0/10 to-do</a>
                            <ul className="right hide-on-med-and-down" style={{textAlign:"center"}}>
                                <li><a onClick={handleAddTask}>Add New</a></li>
                                <li><a className="dropdown-button" href="#!" data-activates="dropdown1">Status<i className="material-icons right">arrow_drop_down</i></a></li>
                                <li><a>Delete All</a></li>   
                                <li><a>Log Out</a></li>
                            </ul>
                        </div>
                    </nav>
	                <div className="row">
	                	{
	                		 userTasks.tasks.map(userTask =>
                                <TaskCard 
                                    key={userTask._id}
                                    user={user}
                                    userTask={userTask}
                                    handleEditTaskNameSubmit={handleEditTaskNameSubmit}
                                    handleEditTaskStatusSubmit={handleEditTaskStatusSubmit}
                                    handleDeleteTaskSubmit={handleDeleteTaskSubmit}
                                />
                            )
	                	}
				        
				    </div>
			    </div> 
            )
        }
    }
}

export default connect((props) => {
    const refreshUserTasksData = {
        userTasksDataFetch: {
            url: `/api/${props.user._id}/tasks`,
            force: true,
            refreshing: true
        }
    };

    return {
        userTasksDataFetch: `/api/${props.user._id}/tasks`,
        addTask: (userID) => ({
            addTaskFetch: {
                url: `/api/${userID}/tasks`,
                method: 'POST',
                force: true,
                refreshing: true,
                andThen: () => (refreshUserTasksData)
            }
        }),
        deleteFinishedTasks: (userID) => ({
            deleteFinishedTasksFetch: {
                url: `/api/${userID}/tasks`,
                method: 'DELETE',
                force: true,
                refreshing: true,
                andThen: () => (refreshUserTasksData)
            }
        }),
        editTask: (userID, taskID, updateTask) => ({
            editTaskFetch: {
                url: `/api/${userID}/task/${taskID}`,
                method: 'PATCH',
                force: true,
                refreshing: true,
                body: JSON.stringify(updateTask),
                andThen: () => (refreshUserTasksData)
            }
        }),
        deleteTask: (userID, taskID) => ({
            deleteTaskFetch: {
                url: `/api/${userID}/task/${taskID}`,
                method: 'DELETE',
                force: true,
                refreshing: true,
                andThen: () => (refreshUserTasksData)
            }
        })
    }
})(Taskstodo);