/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, CheckboxGroup, Checkbox } from "@nextui-org/react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function ConsultationModal({ isOpen, onClose }: ModalProps) {
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        phone: '',
        destination: '',
        startDate: '',
        endDate: '',
        adults: '1',
        children: '0',
        tripType: '',
        budget: '',
        needs: [],
        comments: ''
    });
    const [submissionStatus, setSubmissionStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (value: string[]) => {
        setFormData(prev => ({ ...prev, needs: value as any }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus('loading');
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setSubmissionStatus('success');
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmissionStatus('error');
        }
    };

    const handleClose = () => {
        onClose();
        // Reset form after a short delay to allow the modal to close gracefully
        setTimeout(() => {
            setSubmissionStatus('idle');
            setFormData({
                fullName: '', email: '', phone: '', destination: '',
                startDate: '', endDate: '', adults: '1', children: '0',
                tripType: '', budget: '', needs: [], comments: ''
            });
        }, 300);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} scrollBehavior="inside" size="2xl">
            <ModalContent>
                {(modalOnClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 font-serif">Request a Travel Consultation</ModalHeader>
                        <ModalBody>
                            {submissionStatus === 'success' ? (
                                <div className="text-center py-12">
                                    <h2 className="text-2xl font-bold text-green-500">Thank You!</h2>
                                    <p className="mt-2 text-foreground/80">Your request has been sent. Tim will be in touch with you shortly!</p>
                                </div>
                            ) : submissionStatus === 'error' ? (
                                <div className="text-center py-12">
                                    <h2 className="text-2xl font-bold text-danger">Something Went Wrong</h2>
                                    <p className="mt-2 text-foreground/80">We couldn&apos;t submit your request. Please try again later or contact us directly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    {/* Personal Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input isRequired name="fullName" label="Full Name" value={formData.fullName} onChange={handleInputChange} />
                                        <Input isRequired name="email" type="email" label="Email Address" value={formData.email} onChange={handleInputChange} />
                                    </div>
                                    <Input name="phone" type="tel" label="Phone Number" placeholder="For SMS updates" value={formData.phone} onChange={handleInputChange} />

                                    {/* Trip Details */}
                                    <Input isRequired name="destination" label="Destination(s) of Interest" placeholder="e.g., Paris, France or Caribbean Cruise" value={formData.destination} onChange={handleInputChange} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input name="startDate" type="date" label="Approx. Start Date" value={formData.startDate} onChange={handleInputChange} />
                                        <Input name="endDate" type="date" label="Approx. End Date" value={formData.endDate} onChange={handleInputChange} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input name="adults" type="number" label="Number of Adults" min="1" value={formData.adults} onChange={handleInputChange} />
                                        <Input name="children" type="number" label="Number of Children" min="0" value={formData.children} onChange={handleInputChange} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Select name="tripType" label="Type of Trip" selectedKeys={formData.tripType ? [formData.tripType] : []} onChange={handleInputChange}>
                                            <SelectItem key="family-vacation">Family Vacation</SelectItem>
                                            <SelectItem key="couples-getaway">Couples Getaway / Honeymoon</SelectItem>
                                            <SelectItem key="solo-travel">Solo Travel</SelectItem>
                                            <SelectItem key="group-trip">Group Trip</SelectItem>
                                            <SelectItem key="cruise">Cruise</SelectItem>
                                            <SelectItem key="adventure">Adventure / Expedition</SelectItem>
                                            <SelectItem key="other">Other</SelectItem>
                                        </Select>
                                        <Select name="budget" label="Estimated Budget (per person)" selectedKeys={formData.budget ? [formData.budget] : []} onChange={handleInputChange}>
                                            <SelectItem key="<1500">Under $1,500</SelectItem>
                                            <SelectItem key="1500-3000">$1,500 - $3,000</SelectItem>
                                            <SelectItem key="3000-5000">$3,000 - $5,000</SelectItem>
                                            <SelectItem key="5000-10000">$5,000 - $10,000</SelectItem>
                                            <SelectItem key=">10000">$10,000+</SelectItem>
                                        </Select>
                                    </div>

                                    {/* Travel Needs */}
                                    <CheckboxGroup label="What services do you need?" name="needs" value={formData.needs} onValueChange={handleCheckboxChange} orientation="horizontal">
                                        <Checkbox value="flights">Flights</Checkbox>
                                        <Checkbox value="hotels">Hotels/Resorts</Checkbox>
                                        <Checkbox value="car-rental">Car Rental</Checkbox>
                                        <Checkbox value="cruise">Cruise</Checkbox>
                                        <Checkbox value="tours">Tours & Activities</Checkbox>
                                    </CheckboxGroup>

                                    {/* Additional Info */}
                                    <Textarea name="comments" label="Additional Information" placeholder="Tell us more about your dream trip! Any specific requests or preferences?" value={formData.comments} onChange={handleInputChange} />

                                    <Button color="primary" type="submit" isLoading={submissionStatus === 'loading'}>
                                        Submit Request
                                    </Button>
                                </form>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={handleClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}