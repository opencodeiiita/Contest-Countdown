### Running
* Remove old installation (if any)
    `rm -rf ~/.local/share/gnome-shell/extensions/contestcountdown@raghav`
    
* Copy the gnome folder to `~/.local/share/gnome-shell/extensions/` and rename it to `contestcountdown@raghav`

* Restart gnome by pressing `alt + F2` and typing `r` in the dialog box. (On wayland you will have to log out and log in)
    
* Enable extension using any extension manager, or with the command
    `gnome-extensions enable contestcountdown@raghav  `
    (You only need to do this once)

### Debugging 
* All logs/errors will be recorded in system log, you can view them with `journalctl -f`

* You can also use looking glass. It is like developer console of gnome. Run it by pressing `alt + F2` and typing `lg` in the dialog box.

