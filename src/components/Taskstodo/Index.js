import React, { Component } from 'react';
import { connect, PromiseState } from 'react-refetch';
import TaskCard from './TaskCard';

class Taskstodo extends Component {
	constructor(props) {
        super(props);

        this.state = {tasksFilter: 'allTasks'};
        this.handleOpenTasksSubmit = this.handleOpenTasksSubmit.bind(this);
        this.handleCompletedTasksSubmit = this.handleCompletedTasksSubmit.bind(this);
        this.handleAllTasksSubmit = this.handleAllTasksSubmit.bind(this);
        this.handleAddTask = this.handleAddTask.bind(this);
        this.handleDeleteFinishedTasksSubmit = this.handleDeleteFinishedTasksSubmit.bind(this);
        this.handleEditTaskNameSubmit = this.handleEditTaskNameSubmit.bind(this);
        this.handleEditTaskStatusSubmit = this.handleEditTaskStatusSubmit.bind(this);
        this.handleDeleteTaskSubmit = this.handleDeleteTaskSubmit.bind(this);
    }
    handleOpenTasksSubmit(event) {
        event.preventDefault();

        this.setState({tasksFilter: 'openTasks'});
    }
    handleCompletedTasksSubmit(event) {
        event.preventDefault();

        this.setState({tasksFilter: 'completedTasks'});
    }
    handleAllTasksSubmit(event) {
        event.preventDefault();

        this.setState({tasksFilter: 'allTasks'});
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
                handleOpenTasksSubmit,
                handleCompletedTasksSubmit,
                handleAllTasksSubmit,
                handleAddTask,
                handleDeleteFinishedTasksSubmit,
                handleEditTaskNameSubmit,
                handleEditTaskStatusSubmit,
                handleDeleteTaskSubmit
            } = this;

            return(
            	<div className="body">
                    <nav>
                        <form action="/logout" method="post">
                            <div className="nav-wrapper">
                                <a href="#!" class="brand-logo">
                                    {
                                        userTasks.tasks.filter(userTask =>
                                            userTask.isComplete == true
                                        ).length
                                    }
                                    &nbsp;&#47;&nbsp;
                                    {
                                        userTasks.tasks.length
                                    }
                                    &nbsp;to-do Completed
                                </a>
                                <ul className="right hide-on-med-and-down" style={{textAlign:"center"}}>
                                    <li><a onClick={handleAddTask}>Add New</a></li>
                                    <li><a onClick={handleOpenTasksSubmit}>Open</a></li> 
                                    <li><a onClick={handleCompletedTasksSubmit}>Completed</a></li>
                                    <li><a onClick={handleAllTasksSubmit}>All</a></li>
                                    <li><a onClick={handleDeleteFinishedTasksSubmit}>Delete All</a></li>   
                                    <li>
                                        <div className="logbtn">
                                        <input type="submit" value="Logout" />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </form>    
                    </nav>
	                <div className="row">
                        {
                            tasksFilter == 'allTasks'
                                ?
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
                                :
                                tasksFilter == 'openTasks'
                                    ?
                                    userTasks.tasks.filter(userTask =>
                                            userTask.isComplete == false
                                        ).map(userTask =>
                                            <TaskCard 
                                                key={userTask._id}
                                                user={user}
                                                userTask={userTask}
                                                handleEditTaskNameSubmit={handleEditTaskNameSubmit}
                                                handleEditTaskStatusSubmit={handleEditTaskStatusSubmit}
                                                handleDeleteTaskSubmit={handleDeleteTaskSubmit}
                                            />
                                        )
                                    :   
                                    userTasks.tasks.filter(userTask =>
                                            userTask.isComplete == true
                                        ).map(userTask =>
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
                    <footer 
                        className={
                            userTasks.tasks.length > 3
                                ?
                                "footer-bar"
                                :
                                "footer-bar footer-bar-absolute"
                        }
                    >
                            <div className="containe2">
                            <div className="container" style={{textAlign:"center"}}>
                                © 2017 DoReMiFaSoLa to-do.Alrights Reserved.
                                <a className="grey-text text-lighten-4 right" href="https://coen3463-m1t8.herokuapp.com">Created by: Jocelle Tanqui-on & Jobelle San Juan </a>
                            </div>
                        </div>  
                    </footer>
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