'use client'
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error){
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error, errorInfo){
        console.log('Error caught by Error Boundary: ', error, errorInfo);
    }

    render(){
        if(this.state.hasError){
            return (
                <div>
                    <h2>Something Went Wrong.</h2>
                    <p>{this.state.error?.message || 'Unknown Error'}</p>
                </div>
            );
        }

        return this.props.children;
    }

}

export default ErrorBoundary;
