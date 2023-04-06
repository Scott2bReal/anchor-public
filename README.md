# Anchor

An application used by the operations team to manage the youth rec program at
[First Ascent Climbing & Fitness](https://faclimbing.com)

The actual application is currently under active development, so this demo
version is just a snapshot of its current state as of April 6th, 2023.

## Demo Version

The actual application is restricted to the First Ascent Google Workspace. This
version is a publicly accessible demo version. As such, some features are
limited or not available.

The Slack integration is very specific to the organization, and is therefore
not functional in this demo version.

Logging in with Discord has been added for ease of use, and is not included in
the private version.

[Demo Version](https://anchor-public.vercel.app)

### Concepts

#### Sessions

The youth rec program at the gym is scheduled in 8-week sessions (more info
[here](https://faclimbing.com/chicago/programs/kids/climbing-classes/)). 2-3
weeks before the start of a session, the operations team will begin filling
open roster spots using the waitlist.

#### Classes

The climbing classes are divided up by age group (Stone Warriors, Rock Warriors
etc.). Each type of class has a set number of available roster spots, and a set
duration.

#### Waitlist

When the operations team receives enrollment requests from potential climbers,
that climber will be created in the system by an operations team member and
associated with their parent's contact information.

Available spots in an upcoming session are offered on a first-come first-serve basis. 

#### Offers

After an available spot in an upcoming session is offered to a potential
climber, the operations team member will create an "offer" in the app. This
contains information about when the offer will expire, any notes, and a link to
the Zendesk ticket containing the email conversation with that potential
climber's parent.

Once an offer has expired, the parent will be notified and the operations team
will offer that available roster spot to the next climber on the waitlist.
