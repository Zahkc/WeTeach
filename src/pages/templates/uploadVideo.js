import React, { Fragment } from 'react';
import NavBar from './navBar'
import SideBarTeacher from './sidebar(Teacher)'

class UploadVideo extends React.Component{
    render(){
        return(
         <Fragment>
            <div>
               <NavBar/>
                  <div id="wrapper">
                     <SideBarTeacher/>
                  <div id="content-wrapper">
                    <div className="container-fluid upload-details">
                        <div className="row">
                        <div className="col-lg-12">
                            <div className="main-title">
                            <h6>Upload Details</h6>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="imgplace" />
                        </div>
                        <div className="col-lg-10">
                            <div className="restyled-title">
                            Early Computing: Crash Course Computer Science #1
                            </div>
                            <div className="restyled-size">102.6 MB . 2:13 MIN Remaining</div>
                            <div className="restyled-progress">
                            <div className="progress">
                                <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                aria-valuenow={75}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: "75%" }}
                                />
                            </div>
                            <div className="restyled-close">
                                <a href="#">
                                <i className="fas fa-times-circle" />
                                </a>
                            </div>
                            </div>
                            <div className="restyled-desc">
                            Your Video is still uploading, please keep this page open until it's
                            done.
                            </div>
                        </div>
                        </div>
                        <hr />
                        <div className="row">
                        <div className="col-lg-12">
                            <div className="restyled-form">
                            <div className="row">
                                <div className="col-lg-12">
                                <div className="form-group">
                                    <label htmlFor="e1">Video Title</label>
                                    <input
                                    type="text"
                                    placeholder="Early Computing: Crash Course Computer Science #1"
                                    id="e1"
                                    className="form-control"
                                    />
                                </div>
                                </div>
                                <div className="col-lg-12">
                                <div className="form-group">
                                    <label htmlFor="e2">About</label>
                                    <textarea
                                    rows={3}
                                    id="e2"
                                    name="e2"
                                    className="form-control"
                                    defaultValue={"Description"}
                                    />
                                </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                <div className="form-group">
                                    <label htmlFor="e3">Orientation</label>
                                    <select id="e3" className="custom-select">
                                    <option>Straight</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    </select>
                                </div>
                                </div>
                                <div className="col-lg-3">
                                <div className="form-group">
                                    <label htmlFor="e4">Privacy Settings</label>
                                    <select id="e4" className="custom-select">
                                    <option>Public</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    </select>
                                </div>
                                </div>
                                <div className="col-lg-3">
                                <div className="form-group">
                                    <label htmlFor="e5">Monetize</label>
                                    <select id="e5" className="custom-select">
                                    <option>Yes</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    </select>
                                </div>
                                </div>
                                <div className="col-lg-3">
                                <div className="form-group">
                                    <label htmlFor="e6">License</label>
                                    <select id="e6" className="custom-select">
                                    <option>Standard</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    </select>
                                </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-5">
                                <div className="form-group">
                                    <label htmlFor="e7">Tags (13 Tags Remaining)</label>
                                    <input
                                    type="text"
                                    placeholder="Gaming, PS4"
                                    id="e7"
                                    className="form-control"
                                    />
                                </div>
                                </div>
                                <div className="col-lg-4">
                                <div className="form-group">
                                    <label htmlFor="e8">Cast (Optional)</label>
                                    <input
                                    type="text"
                                    placeholder="Nathan Drake,"
                                    id="e8"
                                    className="form-control"
                                    />
                                </div>
                                </div>
                                <div className="col-lg-3">
                                <div className="form-group">
                                    <label htmlFor="e9">Language in Video (Optional)</label>
                                    <select id="e9" className="custom-select">
                                    <option>English</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    </select>
                                </div>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-lg-12">
                                <div className="main-title">
                                    <h6>Category</h6>
                                </div>
                                </div>
                            </div>
                            {/* Category and Subcategory */}
                            <select id="category" size={1} onchange="makeSubmenu(this.value)">
                                <option value="" disabled="" selected="">
                                Choose Category
                                </option>
                                <option>ComputerScienceAndInformationTechnology</option>
                                <option>CommunicationsAndMedia</option>
                                <option>MedicalScience</option>
                            </select>
                            <select id="categorySelect" size={1}>
                                <option value="" disabled="" selected="">
                                Choose Subcategory
                                </option>
                                <option />
                            </select>
                            <div className="restyled-area text-center mt-3">
                                <button className="btn btn-outline-primary">Save Changes</button>
                            </div>
                            <hr />
                            <div className="terms text-center">
                                <p className="mb-0">
                                Tos <a href="#">Terms of Service</a> and{" "}
                                <a href="#">Community Guidelines</a>.
                                </p>
                                <p className="hidden-xs mb-0">Tos</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>

            </div>
        </Fragment>
        );
    }
}

export default UploadVideo;