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
                <h1>Loading...</h1>
            );
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
            	<div>
	            	<nav>  
			            <ul className="menu">
			            	<li><a href="#" className="clr-5">Finished Count</a></li>
			            	<li><a href="#" className="clr-5">UnFinished Count</a></li>
			                <li><a className="clr-1" onClick={handleAddTask}>Add New</a></li>
			                <li><a href="#" className="clr-2">Status</a></li>
			                <li><a href="#" className="clr-3">Delete All</a></li>
			                <li><a href="#" className="clr-4">Log Out</a></li>
			            </ul>
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