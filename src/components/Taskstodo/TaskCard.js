import React, { Component } from 'react';
import moment from 'moment-timezone';

class TaskCard extends Component {
	 constructor(props) {
        super(props);

        this.state = {editingTask: false};
        this.handleEditTaskState = this.handleEditTaskState.bind(this);
        this.handleEditTaskNameSubmit = this.handleEditTaskNameSubmit.bind(this);
        this.handleEditTaskStatusSubmit = this.handleEditTaskStatusSubmit.bind(this);
        this.handleDeleteTaskSubmit = this.handleDeleteTaskSubmit.bind(this);
    }
     handleEditTaskState(event) {
        event.preventDefault();

        var toggleEditingTask = !this.state.editingTask;

        this.setState({editingTask: toggleEditingTask});
    }
    handleEditTaskNameSubmit(event) {
        event.preventDefault();

        const {
            user,
            userTask,
            handleEditTaskNameSubmit,
        } = this.props;
        let userID = user._id;
        let taskID = userTask._id;
        let updateTask = userTask;

        updateTask.name = this.refs.taskName.value;

        handleEditTaskNameSubmit(userID, taskID, updateTask);

        this.setState({editingTask: false});
    }
    handleEditTaskStatusSubmit(event) {
        event.preventDefault();

        const {
            user,
            userTask,
            handleEditTaskStatusSubmit,
        } = this.props;
        let userID = user._id;
        let taskID = userTask._id;
        let updateTask = userTask;

        updateTask.isComplete = !updateTask.isComplete;

        handleEditTaskStatusSubmit(userID, taskID, updateTask);
    }
    handleDeleteTaskSubmit(event) {
        event.preventDefault();

        const {
            user,
            userTask,
            handleDeleteTaskSubmit,
        } = this.props;
        let userID = user._id;
        let taskID = userTask._id;

        handleDeleteTaskSubmit(userID, taskID)
    }
    render() {
    	const { 
    		user,
    		userTask 
    	} = this.props; 
    	const { editingTask } = this.state;
    	const {
            handleEditTaskState,
            handleEditTaskNameSubmit,
            handleEditTaskStatusSubmit,
            handleDeleteTaskSubmit
        } = this;

        return (
            <div className="col s12 m4">
	            {
	                    editingTask == false
	                        ?
	                        <div className="card amber lighten-2">
					            <div className="card-content black-text">
					            	<p>
					            		Created:&nbsp;
					            		{
				                            moment(userTask.createdAt)
				                                .tz("Asia/Manila")
				                                .format("MMM DD, YYYY hh:mm A")
				                        }
					            	</p>
					            	{
				              			userTask.isComplete == false
				              				?
				              				<div>
					              				<span className="card-title">
									              	{
										              	userTask.name
										            }
								              	</span>
								              	<p>
								              		Not Completed
								              	</p>
							              	</div>
							              	:
							              	<div>
				              				<strike>
					              				<span className="card-title">
									              	{
										              	userTask.name
										            }
								              	</span>
							              	</strike>	
							              	<p>
							              		Completed
							              	</p>
							              	</div>	
				              		}
					            </div>
					            <div className="card-action">
					            	<div className="fixed-action-btn horizontal">
									    <a className="btn-floating btn-large green">
									      <i className="large material-icons">mode_edit</i>
									    </a>
									    <ul>
									      <li><a className="btn-floating orange lighten-1" onClick={handleEditTaskState}><i className="material-icons">mode_edit</i></a></li> 
									      <li><a className="btn-floating green" onClick={handleEditTaskStatusSubmit}><i className="material-icons">done</i></a></li>          
									      <li><a className="btn-floating red" onClick={handleDeleteTaskSubmit}><i className="material-icons">delete</i></a></li> 
									    </ul>
									</div>
								</div>
					        </div>
	                        :
	                        <div className="card red">
					            <div className="card-content black-text">
					              	<div class="input-field col s6">
								        <input ref="taskName" placeholder="Enter your task name here" type="text" class="validate" defaultValue={userTask.name}/>
							        </div>
					              	<p>
					              		{
					              			userTask.isComplete == false
					              				?
					              					"Not Completed"
					              				:
					              					"Completed"
					              		}
					              	</p>
					            </div>
					            <div className="card-action">
					            	<a onClick={handleEditTaskNameSubmit}>Update</a>
              						<a onClick={handleEditTaskState}>Cancel</a>
								</div>
					        </div>

	            }            
	        </div>
        )
    }
}

export default TaskCard;
