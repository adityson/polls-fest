import Poll from '../models/poll.js'
import mongoose from 'mongoose'

export const getPolls = async(req, res) => {
    try{
        const polls = await Poll.find({});
        res.send(polls);
    } catch(err) {
        res.send({message: err.message})
    }
}

export const createPoll = async(req,res) => {
    try{
        const poll = new Poll(req.body);
        await poll.save();
        res.send(poll);
    } catch(err) {
        res.send({message: err.message});
    }
}

export const deletePoll = async(req,res) => {
    const { id } = req.params;
    await Poll.findByIdAndDelete(id);
    res.json({ message: 'Post Deleted Successfully'});
}

export const likePoll = async(req,res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send('No post with that id');

    const poll = await Poll.findById(id);
    const updPoll = await Poll.findByIdAndUpdate(id, { likes: poll.likes + 1 }, { new: true });
    res.send(updPoll);
}

export const votePoll = async(req,res) => {
    const { id, choiceId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send('No post with that id');

    const poll = await Poll.findById(id);
    const curChoices = poll.choices;
    const updChoices = curChoices.map((cho) => choiceId === cho._id.toString() ? {...cho.toObject(), votes: cho.votes + 1} : cho);
    const updVotes = poll.votes + 1;
    const updPoll = await Poll.findByIdAndUpdate(id, { votes: updVotes, choices: updChoices }, {new: true});
    res.send(updPoll);
}
