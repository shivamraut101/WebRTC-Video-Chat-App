import React from 'react';

const Lobby = () => {
  return (
    <form className="max-w-md mx-auto mt-8">
      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          placeholder="john.doe@example.com"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="text" className="block text-gray-700 text-sm font-bold mb-2">
          Text
        </label>
        <input
          type="text"
          id="text"
          name="text"
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          placeholder="Enter text"
        />
      </div>

      <div className="mb-6">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Lobby;
