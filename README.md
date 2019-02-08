<h1 align="center">
  <a href="https://github.com/fanglinchen/DejaWu" title="DejaWu">
    <img alt="DejaWu" src="https://github.com/fanglinchen/DejaWu/raw/master/assets/128.png" width="100px" height="100px" />
  </a>
  <br />
  Déjà Wù
</h1>

Déjà Wù is a chrome extension that can help users find stuff they've seen. [ [Scenario Sheet](https://docs.google.com/document/d/1_vBY0j2QEbjRc0NlRFsm7qUONufinM4VB0Kkb7f8Zcs/edit?usp=sharing) ]

![Alt Text](https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/Chrome_Omnibox-final.gif)

Here are some rationales while we are designing Deja Wu.

Deja Wu

insight 1: personal information or knowledge are managed by individual tools, which causes information fragmentation. This introduces user inefficiencies because users are left to associate different related information items and maintain consistency accross separate project hierachies. 

insight 2: information items are meaningful beyond the context of the tool which manages them. Email items are usually informing new calendar items; file folders are structured 

insight 3: all one web -> office web/ calendar web/ email web/ web is for most of the information access. 

insight 4: knowledge work is evolutionary by nature. It is equally important to investigate the transience of information, where does it come from, how is it passed from one tool to another and when is it no longer needed. 

insight 5: introducing additional models or interfaces generally cause learning curve on users. To lower the cognitive overhead in adjusting to Deja Wu, we integrate Deja Wu as part of the existing workflow of browser search when users are in need of accessing information. There are no additional user interfaces - for example, WorldBrain provides an alternative display to the right of the search results whenever user search something in Google, which 1) overshadows the structured knowledge graph content on the right, and 2) introduces a cognitive overhead for users to wonder which information to go to. 

insight 6: a timeline might improve the awareness of ongoing activities therefore help knowledge workers bettter focus on their tasks. 

Study decisions:

1. Participants were recruited from a broad range of backgrounds, including software developments, researchers, education practioners to represent different types of knowledge work. We required participants to have experience with Chrome browser and use Chrome browser on a daily basis for personal use. 

Design decisions:

1. Deja Wu embraces the entire life cycle of complex knowledge work, acknowledging short- and long-term planning, archiving, multitasking and self-interruption in user's online activity. Without providing support for these practices, the benefits of activity-centric systems are potentially lost since low-level application and document configuration problems are simply replaced with higher-level activity management challenges.

2. When users are engaged in information consumption, Deja Wu's user interface is kept to a bare minimum, no new interface elements are introduced, as compared to other personal information management systems such as [WorldBrain]. Casted into a omnibox, the search bar is the heart of the extension, matching user-provided text queries to learned information items visited by users. 


3. Colors, icons and xxx are powerful cues for recall by invoking episodic memory, and used in the suggestions for users to decide whether access a particular piece of information item. 

4. 

