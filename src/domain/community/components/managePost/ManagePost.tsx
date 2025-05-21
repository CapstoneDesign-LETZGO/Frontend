import React from 'react';
import ManagePostHeader from './ManagePostHeader';
import ManagePostForm from './ManagePostForm';

const ManagePost: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-[#F5F5F5]">
            <div className="flex flex-col min-h-screen w-full max-w-md mx-auto px-4 bg-white">
                <ManagePostHeader />
                <ManagePostForm />
            </div>
        </div>
    );
};

export default ManagePost;
