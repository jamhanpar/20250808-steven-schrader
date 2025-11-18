"use client";

import { useModal } from "../hooks/useModal";
import Modal from "../components/modal/Modal";

export default function ModalExamplePage() {
  const [modalState, modalControls] = useModal();

  const openSimpleModal = () => {
    modalControls.openModal({
      title: "Simple Modal Example",
      content: (
        <div>
          <p>This is a simple modal with dynamic content!</p>
          <button
            onClick={() =>
              modalControls.updateContent(<p>Content has been updated!</p>)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Update Content
          </button>
          <button
            onClick={() => modalControls.updateTitle("New Title!")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update Title
          </button>
        </div>
      ),
    });
  };

  const openLargeModal = () => {
    modalControls.openModal({
      title: "Large Modal Example",
      content: (
        <div className="space-y-4">
          <p>This is a large modal with more content.</p>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Dynamic content updates</li>
              <li>Multiple size options</li>
              <li>Glass morphism design</li>
              <li>Accessible keyboard navigation</li>
              <li>Customizable close behavior</li>
            </ul>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Modal System Examples</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Basic Modal Usage</h2>
          <button
            onClick={openSimpleModal}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open Simple Modal
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Large Modal</h2>
          <button
            onClick={openLargeModal}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Open Large Modal
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Form</h2>
          <p className="text-gray-600 mb-2">
            The contact form is available via the floating chat button in the
            bottom right corner.
          </p>
        </div>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        onClose={modalControls.closeModal}
        size="lg"
      >
        {modalState.content}
      </Modal>
    </div>
  );
}
